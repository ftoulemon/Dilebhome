<?php
    $username = "root";
    $password = "";
    $host = "chip";
    $database="Electricity";

    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

    if (($_GET['data'] == 'info') || ($_GET['data'] == 'system')) {
        $myquery = "SELECT * FROM " . $_GET['data'];
        $query = mysql_query($myquery);
        if ( ! $query ) {
            echo mysql_error();
            die;
        }
        echo json_encode(mysql_fetch_assoc($query));
    }
    else {
        if ($_GET['period'] == 'last') {
            $myquery = "SELECT * FROM `records_minute` ORDER BY ts DESC LIMIT 1";
        }
        else if ($_GET['period'] == 'minute') {
            if (isSet($_GET['date'])) {
                $myquery = "SELECT * FROM `records_minute` WHERE DATE(`ts`) = '" . $_GET['date'] . "'";
            } else {
                $myquery = "SELECT * FROM `records_minute` WHERE DATE(`ts`) = CURDATE()";
            }
        }
        else if ($_GET['period'] == 'hour') {
            $myquery = "SELECT * FROM `records_hour` WHERE DATE(`ts`) = CURDATE()";
        }
        else if ($_GET['period'] == 'month') {
            $myquery = "SELECT * FROM `records_day`";
        }
        else {
            $myquery = '';
        }
        $query = mysql_query($myquery);

        if ( ! $query ) {
            echo mysql_error();
            die;
        }

        $data = array();

        for ($x = 0; $x < mysql_num_rows($query); $x++) {
            $data[] = mysql_fetch_assoc($query);
        }

        echo json_encode($data);
    }

    mysql_close($server);
?>
