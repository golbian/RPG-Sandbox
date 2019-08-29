
const debug = require('debug')('RPG-Sanbox:server');

    const app = require('./app');

    var ipaddr = process.env.IP || config.get('ip');
    var port = process.env.PORT || config.get('port');

    var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 9090, clientTracking: true});

    wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
      wss.clients.forEach(function each(client) {
        console.log(client);
          client.send(data);
      });
    });
  });
    var server = app.listen(port, ipaddr);
    debug('Server running at http://' + ipaddr + ':' + port + '/');
