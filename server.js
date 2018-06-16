'use strict';

//External Dependencies
const Hapi = require('hapi');

//Internal Dependencies
const Config = require('./Config');
const Routes = require('./Routes');
const Plugins = require('./Plugins');
const Bootstrap = require('./Utils/BootStrap');

//Create Server
const server = new Hapi.Server({
    app: {
        name: Config.APP_CONSTANTS.SERVER.appName,
        debug: true
    }
});

server.connection({
    port: Config.APP_CONSTANTS.SERVER.PORTS.HAPI,
    routes: { cors: true }
});

//Register All Plugins
server.register(Plugins, function (err) {
    if (err){
        server.error('Error while loading plugins : ' + err)
    }else {
        server.log('info','Plugins Loaded')
    }
});

//Default Routes
server.route(
    {
        method: 'GET',
        path: '/',
        handler: function (req, res) {
            res.view('index')
        }
    }
);

//API Routes
server.route(Routes);

//Adding Views
server.views({
    engines: {
        html: require('handlebars')
    },
    relativeTo: __dirname,
    path: './Views'
});



//Start Server
server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
});

