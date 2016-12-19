# coding: utf-8

import serial
import time
import datetime
import logging

from DbConnector import DbConnector

class Acquisition(object):
    def __init__(self):
        """
        Constructor
        """
        self._StopRequested = False
        self._PreviousTime = datetime.datetime.now()


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

    def __ProcessFrame(self, aFrame):
        """
        Save the data in the the database
        """
        wCurrentTime = datetime.datetime.now()
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
            if (wCurrentTime - self._PreviousTime).seconds >= 5:
                # Every 30, update the info
                logging.info("Update info")
                try:
                    # save info
                    self.__UpdateInfo(wDb, wDic['ADCO'], wDic['OPTARIF'], wDic['ISOUSC'], wDic['IMAX'])
                except Exception as e:
                    logging.error("Update info error: {0}".format(e))
                try:
                    # save new record
                    self.__SaveRecord(wDb, aDb.RECORDS_M_TABLE,
                            wDic['HCHC'], wDic['HCHP'])
                except Exception as e:
                    logging.error("Save record error: {0}".format(e))
                self._PreviousTime = wCurrentTime


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
            return
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
                    self.__ProcessFrame(wFrame)
                    # sleep almost 1 minute
                    time.sleep(10)
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

    def Stop(self):
        self._StopRequested = True

