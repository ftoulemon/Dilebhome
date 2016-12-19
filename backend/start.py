#!/usr/bin/python
# coding: utf-8

import sys
import signal
import logging
import argparse

from lib.DbConnector import DbConnector
from lib.Acquisition import Acquisition
from lib.SystemMonitor import SystemMonitor

acq = Acquisition()
sm = SystemMonitor()

dicTable = {
       'minute': DbConnector.RECORDS_M_TABLE,
       'hour': DbConnector.RECORDS_H_TABLE,
       'day': DbConnector.RECORDS_D_TABLE,
       'month': DbConnector.RECORDS_O_TABLE,
       'year': DbConnector.RECORDS_Y_TABLE
}


def signalHandler(signal, frame):
    logging.warning("Caught ^C")
    acq.Stop()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
            description = 'Start acquisition'
            )
    parser.add_argument("-v", "--verbose", help="Verbositiy setting",
            action="count", default=0)
    parser.add_argument("-p", "--period", help="Period to record",
            default='minute',
            choices=dicTable.keys()
            )
    args = parser.parse_args()
    # configure logging
    if args.verbose == 1:
        wLogLevel = logging.WARNING
    elif args.verbose == 2:
        wLogLevel = logging.INFO
    elif args.verbose >= 3:
        wLogLevel = logging.DEBUG
    else:
        wLogLevel = logging.ERROR
    logging.basicConfig(level=wLogLevel)
    logging.info('Started')
    # signal handling
    signal.signal(signal.SIGINT, signalHandler)
    # start things
    with DbConnector() as wDb:
        wDb.Init()
    # data
    wFrame = acq.GetData()
    acq.ProcessFrame(dicTable[args.period], wFrame)
    # system monitoring
    if args.period == 'minute':
        sm.Monitor()
    # exit things
    sys.exit(0)

