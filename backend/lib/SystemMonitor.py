import os
import threading
import time

from DbConnector import DbConnector

class SystemMonitor(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self._WaitPeriod = 10
        self._Continue = True


    def __Monitor(self):
        # Get available space
        wStat = os.statvfs('/')
        wTotal = wStat.f_frsize * wStat.f_blocks
        wAvail = wStat.f_frsize * wStat.f_bavail
        wUsedPercent = int(100 * (wTotal - wAvail) / wTotal)
        with DbConnector() as wDb:
            wDb.UpdateSystem(wUsedPercent)


    def run(self):
        time.sleep(3)
        while self._Continue:
            self.__Monitor()
            # Wait
            for x in range(0, self._WaitPeriod):
                time.sleep(1)
                if not self._Continue:
                    break

    def Stop(self):
        self._Continue = False
