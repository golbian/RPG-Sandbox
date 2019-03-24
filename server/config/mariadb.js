const mariadb = require('mariadb');
mariadb
 .createConnection({
   host: 'localhost',
   ssl: true,
   user: 'goliatt',
   password:'spyro13620',
   database:'RPG-Sanbox'
 }).then(conn => {})
