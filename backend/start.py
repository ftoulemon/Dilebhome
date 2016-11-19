#!/usr/bin/python
# coding: utf-8

import sys
import signal

from lib.DbConnector import DbConnector
from lib.Acquisition import Acquisition
from lib.SystemMonitor import SystemMonitor

acq = Acquisition()
sm = SystemMonitor()

def signalHandler(signal, frame):
    print "Caught ^C"
    acq.Stop()
    sm.Stop()


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signalHandler)
    with DbConnector() as wDb:
        wDb.Init()
    sm.start()
    acq.GetData()
    sys.exit(0)

