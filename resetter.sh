#!/bin/bash
# Commands available, ./init.sh, ./init.sh all, ./init.sh dummy

# Make sure you use LF instead of CRLF.
# This can be changed in VSCode bottom right corner.

# First switch to user postgres
    # $ sudo -su postgres

# Then run psql 
# (Or you can just do sudo -u postgres psql in one line without switching user)
    # $ psql

# You should see postgres=# 

# You may need to change the password for user postgres
    # postgres=# alter user postgres with password 'StrongAdminP@ssw0rd'

# Check connection info
    # postgres=# \conninfo

# Update your config file accordingly. You may need to run init.sh as postgres in your terminal.

## Set and load configuration file
config="./.env"

. $config
PGPASSWORD=${DB_PASS} psql -U ${DB_USER} -p ${DB_PORT} -h ${DB_HOST} ${DB_NAME} < db/database_resetter.sql &> /dev/null
