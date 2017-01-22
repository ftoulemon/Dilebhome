# Dilebhome

Read electric consumption information from electronic electric meter.

# Setup

## Electronic

![Schematics](http://www.magdiblog.fr/wp-content/uploads/2014/05/teleinfo_schema.jpg)

[Source](http://www.magdiblog.fr/gpio/teleinfo-edf-suivi-conso-de-votre-compteur-electrique/)

[Protocol documentation](http://www.magdiblog.fr/wp-content/uploads/2014/09/ERDF-NOI-CPT_02E.pdf)

## Dependencies

- mysql-server
- libmysqlclient-dev

And backend/requirements.txt

## Mysql

    # Create DB
    CREATE DATABASE Electricity;
    # Frontend access
    CREATE USER 'frontend'@'%' IDENTIFIED BY 'frontendpwd';
    GRANT SELECT ON Electricity.* TO 'frontend'@'%';
    # Not secure. For maintenance op only.
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'password';
    # Flush
    FLUSH PRIVILEGES;

And run:

    # backend/start.py --setup

## UART config

From C.H.I.P. official doc: http://docs.getchip.com/chip.html#uart

# Output

![webpage](https://github.com/ftoulemon/Dilebhome/raw/master/res/webpage.png)

Thanks to [materializecss](http://materializecss.com/)
