#!/usr/bin/python
# coding: utf-8

import os
import sys
import signal
import logging
import argparse

from crontab import CronTab

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


def SetupCrontab():
    """
    Setup the crontab.
    """
    logging.info("Setup crontab")
    wFile = os.path.abspath(__file__)
    wCron = CronTab(tabfile='/etc/crontab', user=False)
    # Clear existing jobs, if any
    wCron.remove_all(command=wFile)
    # Create jobs
    wJobminute = wCron.new(command=wFile + ' -p minute', user='root')
    wJobminute.setall('* * * * *')
    wJobhour = wCron.new(command=wFile + ' -p hour', user='root')
    wJobhour.setall('@hourly')
    wJobday = wCron.new(command=wFile + ' -p day', user='root')
    wJobday.setall('@daily')
    wJobmonth = wCron.new(command=wFile + ' -p month', user='root')
    wJobmonth.setall('@monthly')
    wJobyear = wCron.new(command=wFile + ' -p year', user='root')
    wJobyear.setall('@yearly')
    # Save
    wCron.write()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
            description = 'Start acquisition'
            )
    parser.add_argument("-s", "--setup", help="Setup crontab and exit",
            action="store_true", default=False)
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
    if args.setup is True:
        SetupCrontab()
        # start things
        with DbConnector() as wDb:
            wDb.Init()
    else:
        # data
        wRetry = 3
        while wRetry > 0:
            wRetry -= 1
            wFrame = acq.GetData()
            if wFrame != None and wFrame != '':
                wRet = acq.ProcessFrame(dicTable[args.period], wFrame)
                if wRet == True:
                    wRetry = 0
        # system monitoring
        if args.period == 'minute':
            sm.Monitor()
    # exit things
    sys.exit(0)

