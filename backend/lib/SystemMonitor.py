import os
import logging

from DbConnector import DbConnector

class SystemMonitor(object):
    def __init__(self):
        pass

    def Monitor(self):
        # Get available space
        wStat = os.statvfs('/')
        wTotal = wStat.f_frsize * wStat.f_blocks
        wAvail = wStat.f_frsize * wStat.f_bavail
        wUsedPercent = int(100 * (wTotal - wAvail) / wTotal)
        logging.info("Disk usage: {0}%".format(wUsedPercent))
        with DbConnector() as wDb:
            wDb.UpdateSystem(wUsedPercent)


