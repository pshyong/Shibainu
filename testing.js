const shell = require('shelljs')
require('dotenv').config();
shell.exec(`PGPASSWORD=${process.env.DB_PASS} psql -U ${process.env.DB_USER} -p ${process.env.DB_PORT} -h ${process.env.DB_HOST} ${process.env.DB_NAME} < db/database_resetter.sql &> /dev/null`);