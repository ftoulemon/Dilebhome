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
        $myquery = "SELECT  `ts`, `iinst`, `hchc`, `hchp` FROM `records`";
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
