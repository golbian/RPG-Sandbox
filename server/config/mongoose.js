module.exports = function (_, done) {
    const path = require('path');
    const mongoose = require('mongoose');
    const debug = require('debug')('RPG-Sandbox:server');

    if (config.get('db_type') === 'tingoDB') {
        // global.connection = mongoose.connect('tingodb:'+global.tingo_db_path);
        debug('tingo DB connection');
        global.TUNGUS_DB_OPTIONS = { nativeObjectID: true, searchInArray: true };
        global.connection = mongoose.connect('mongodb://data', { useNewUrlParser: true } );
    } else {
        global.connection = mongoose
        .connect("mongodb://localhost:27017/rpgSandbox", {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }).then(()=>{
            // new User({
            //     name: "admin",
            //     readOnly: false,
            //     canCreate: true,
            //     canUpdate: true,
            //   }).save(err => {
            //     if (err) {
            //       console.log("error", err);
            //     }
            //     console.log("added 'admin' to roles collection");
            //   });
            console.log("Connected to the database")
        }).catch(err => {
            console.log("Cannot connect to the database!", err);
            process.exit();
        })

    }

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
        connection.close(function () {
            debug('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    var fs = require('fs');

    // Custom models
    var models_dir = path.join(__dirname, '..', 'custom');
    fs.readdirSync(models_dir).forEach(function (file) {
        if (file[0] === '.') return;
        require(models_dir + '/' + file + '/model.js');
    });
};
