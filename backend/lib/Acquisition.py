# coding: utf-8

import serial

from DbConnector import DbConnector

class Acquisition(object):
    def __init__(self):
        """
        Constructor
        """
        self._StopRequested = False


    def __ProcessFrame(self, aFrame):
        """
        Save the data in the the database
        """
        with DbConnector() as wDb:
            print aFrame


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
        except:
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
                if wByte == chr(2):
                    self.__ProcessFrame(wFrame)
                else:
                    wFrame += wByte
            except Exception as e:
                self._StopRequested = True
        # close port
        try:
            wPort.close()
        except exception as e:
            print e

    def Stop(self):
        self._StopRequested = True

