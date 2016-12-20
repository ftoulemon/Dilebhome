# coding: utf-8

import serial
import logging

from DbConnector import DbConnector

class Acquisition(object):
    def __init__(self):
        """
        Constructor
        """
        self._StopRequested = False


    def __UpdateInfo(self, aDb, aADCO, aOPTARIF, aISOUSC, aIMAX):
        """
        Save the info
        """
        aDb.UpdateInfo(aADCO, aOPTARIF, aISOUSC, aIMAX)

    def __SaveRecord(self, aDb, aTable, aHCHC, aHCHP):
        """
        Save new record
        """
        # Get last data
        wLast = aDb.GetLastRecord(aTable)
        logging.debug("Last: {0}".format(wLast))
        if wLast:
            try:
                aDb.SaveRecord(aTable,
                        aHCHC, aHCHP,
                        int(aHCHC) - int(wLast['hchc']),
                        int(aHCHP) - int(wLast['hchp']))
            except Exception as e:
                logging.warning("Can't save data: {0}".format(e))
        else:
            aDb.SaveRecord(aTable,
                    aHCHC, aHCHP, 0, 0)

    def ProcessFrame(self, aTable, aFrame):
        """
        Save the data in the the database
        """
        wRet = False
        # TODO: test frame integrity
        # Frame to dictionary
        wDic = {}
        for i in aFrame.strip().split('\n'):
            wWord = i.split()
            if 3 == len(wWord):
                wDic[wWord[0]] = wWord[1]
        logging.debug(wDic)
        # Save data in DB
        with DbConnector() as wDb:
            if aTable == wDb.RECORDS_M_TABLE:
                # Update the info
                logging.info("Update info")
                try:
                    # save info
                    self.__UpdateInfo(wDb, wDic['ADCO'], wDic['OPTARIF'],
                            wDic['ISOUSC'], wDic['IMAX'])
                except Exception as e:
                    logging.error("Update info error: {0}".format(e))
            # save new record
            try:
                self.__SaveRecord(wDb, aTable,
                        wDic['HCHC'], wDic['HCHP'])
                wRet = True
            except Exception as e:
                logging.error("Save record error: {0}".format(e))
        return wRet


    def GetData(self):
        """
        Read data from the serial port
        """
        START_OF_FRAME = chr(2)
        END_OF_FRAME = chr(3)
        # open the port
        try:
            wPort = serial.Serial("/dev/ttyS0",
                    baudrate=1200,
                    bytesize=serial.SEVENBITS,
                    stopbits=serial.STOPBITS_ONE,
                    parity=serial.PARITY_ODD,
                    timeout=10)
        except Exception as e:
            logging.error("Can't open serial: {0}".format(e))
            return None
        wByte = ''
        wFrame = ''
        # Seek start of frame
        while wByte != START_OF_FRAME:
            wByte = wPort.read()
        # Main loop
        while not self._StopRequested:
            try:
                wByte = wPort.read()
                if wByte == START_OF_FRAME:
                    wFrame = ''
                elif wByte == END_OF_FRAME:
                    self._StopRequested = True
                else:
                    wFrame += wByte
            except Exception as e:
                logging.error("Read error: {0}".format(e))
                self._StopRequested = True
        # close port
        try:
            wPort.close()
        except exception as e:
            logging.error("IO error: {0}".format(e))
            return None
        return wFrame

    def Stop(self):
        self._StopRequested = True

