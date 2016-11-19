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

def signalHandler(signal, frame):
    logging.warning("Caught ^C")
    acq.Stop()
    sm.Stop()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
            description = 'Start acquisition'
            )
    parser.add_argument("-v", "--verbose", help="Verbositiy setting",
            action="count", default=0)
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
    sm.start()
    acq.GetData()
    # exit things
    sys.exit(0)

