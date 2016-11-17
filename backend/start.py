#!/usr/bin/python
# coding: utf-8

import sys
import signal

from lib.Acquisition import Acquisition

acq = Acquisition()

def signalHandler(signal, frame):
    print "Caught ^C"
    acq.Stop()


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signalHandler)
    acq.GetData()
    sys.exit(0)

