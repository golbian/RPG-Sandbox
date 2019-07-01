
const debug = require('debug')('RPG-Sanbox:server');

    const app = require('./app');

    var ipaddr = process.env.IP || config.get('ip');
    var port = process.env.PORT || config.get('port');

    app.listen(port, ipaddr);
    debug('Server running at http://' + ipaddr + ':' + port + '/'); 
