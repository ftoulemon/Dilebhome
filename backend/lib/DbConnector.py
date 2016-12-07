# coding: utf-8

import logging
import MySQLdb
from warnings import filterwarnings

class DbConnector(object):
    """
    Connect with mysql DB
    """
    RECORDS_TABLE = 'records'
    INFO_TABLE = 'info'
    SYSTEM_TABLE = 'system'

    def __enter__(self):
        """
        Entry point. Connect to DB.
        """
        self._DB = None
        try:
            self._DB = MySQLdb.connect(host = "localhost",
                                    user = "root",
                                    passwd = "password",
                                    db = "Electricity")
        except Exception as e:
            logging.error("Can't connect to DB: {0}".format(e))
            return
        # Get cursor
        self._Cursor = self._DB.cursor()
        return self


    def __exit__(self, type, value, tb):
        """
        Close connection
        """
        if self._DB is not None:
            self._DB.commit()
            self._DB.close()


    def Init(self):
        """
        Initialize the DB tables
        """
        filterwarnings('ignore', category = MySQLdb.Warning)
        # Record table
        try:
            self._Cursor.execute("CREATE TABLE IF NOT EXISTS {0} "
                    "(iinst INT, "
                    "hchc INT, "
                    "hchp INT, "
                    "ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"
                    .format(self.RECORDS_TABLE))
        except Exception as e:
            logging.error("Error creating table {0}: {1}".format(self.RECORDS_TABLE, e))
        # Info table
        try:
            self._Cursor.execute("CREATE TABLE IF NOT EXISTS {0} "
                    "(adco VARCHAR(15) NOT NULL, "
                    "optarif VARCHAR(5), "
                    "isousc VARCHAR(5), "
                    "imax VARCHAR(5), "
                    "UNIQUE (adco))"
                    .format(self.INFO_TABLE))
        except Exception as e:
            logging.error("Error creating table {0}: {1}".format(self.INFO_TABLE, e))
        # System table
        try:
            self._Cursor.execute("CREATE TABLE IF NOT EXISTS {0} "
                    "(id INT NOT NULL, "
                    "du INT NOT NULL, "
                    "UNIQUE (id))"
                    .format(self.SYSTEM_TABLE))
        except Exception as e:
            logging.error("Error creating table {0}: {1}".format(self.SYSTEM_TABLE, e))


    def UpdateSystem(self, aDU):
        """
        Update system table
        """
        wCommand = ("INSERT INTO {0} "
               "(id, du) "
               "VALUES "
               "(0, {1}) "
               "ON DUPLICATE KEY UPDATE "
               "du={1}"
               .format(self.SYSTEM_TABLE, aDU))
        self._Cursor.execute(wCommand)

    def UpdateInfo(self, aADCO, aOPTARIF, aISOUSC, aIMAX):
        """
        Update the information table
        """
        wCommand = ("INSERT INTO {0} "
               "(adco, optarif, isousc, imax) "
               "VALUES "
               "('{1}', '{2}', '{3}', '{4}') "
               "ON DUPLICATE KEY UPDATE "
               "optarif='{2}', isousc='{3}', imax='{4}'"
               .format(self.INFO_TABLE, aADCO, aOPTARIF, aISOUSC, aIMAX))
        self._Cursor.execute(wCommand)

    def SaveRecord(self, aIINST, aHCHC, aHCHP):
        """
        Insert a new record in the records table
        """
        wCommand = ("INSERT INTO {0} (iinst, hchc, hchp) "
                            "VALUES "
                            "({1}, {2}, {3})"
                            .format(self.RECORDS_TABLE, aIINST, aHCHC, aHCHP))
        self._Cursor.execute(wCommand)


