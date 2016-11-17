# coding: utf-8

import MySQLdb

class DbConnector(object):
    """
    Connect with mysql DB
    """
    RECORDS_TABLE = 'records'
    INFO_TABLE = 'info'

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
            print "Can't connect to DB:", e
            return
        # Get cursor
        self._Cursor = self._DB.cursor()
        # Init tables
        try:
            self._Cursor.execute("CREATE TABLE IF NOT EXISTS {0} "
                    "(value INT, "
                    "ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"
                    .format(self.RECORDS_TABLE))
        except Exception as e:
            print "Error creating table {0}: {1}".format(self.RECORDS_TABLE, e)
        # Create table
        try:
            self._Cursor.execute("CREATE TABLE IF NOT EXISTS {0} "
                    "(adco VARCHAR(15) NOT NULL, "
                    "optarif VARCHAR(5), "
                    "UNIQUE (adco))"
                    .format(self.INFO_TABLE))
        except Exception as e:
            print "Error creating table {0}: {1}".format(self.INFO_TABLE, e)


    def __exit__(self, type, value, tb):
        """
        Close connection
        """
        if self._DB is not None:
            self._DB.close()


    def UpdateInfo(self, aADCO, aOPTARIF, aISOUSC):
        """
        Update the information table
        """
        self._Cursor.execute("INSERT INTO {0} "
               "(adco, optarif, isousc) "
               "VALUES "
               "('{1}', '{2}', '{3}') "
               "ON DUPLICATE KEY UPDATE "
               "optarif='{2}', isousc='{3}'"
               .format(self.INFO_TABLE, aADCO, aOPTARIF, aISOUSC))

    def SaveRecord(self, aRecord):
        """
        Insert a new record in the records table
        """
        self._Cursor.execute("INSERT INTO {0} (value) "
                            "VALUES "
                            "({1})"
                            .format(self.RECORDS_TABLE, aRecord))


