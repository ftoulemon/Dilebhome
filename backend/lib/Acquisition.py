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
                    wDb.UpdateInfo(wDic['ADCO'], wDic['OPTARIF'], wDic['ISOUSC'])
                except Exception as e:
                    logging.error("Update info error: {0}".format(e))
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
                    time.sleep(1)
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

