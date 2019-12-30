var express = require('express');
var fs = require('fs');
var localdb = require('@levelupsoftware/localdb');

var notebook = {

    init: async function (app, db, auth) {

        var schema = JSON.parse(fs.readFileSync(__dirname + '/dbschema.json'));
        await db.init(schema);

        // Module initialisieren
        await localdb.init(app);

        app.use('/api/notebook/book', require('./api/book')(express.Router(), db, auth));
        app.use('/api/notebook/page', require('./api/page')(express.Router(), db, auth));

        app.use('/static/notebook', express.static(__dirname + '/public'));
    }

};

module.exports = notebook;