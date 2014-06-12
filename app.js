/*
Contains methods to initalize connection and hanfle request from client for creating editing and deleting tickets. 

*/
var TMS = function () {

}

TMS.prototype.launchServer = function (port) {
    //init the variables
    var express = require('express');
    var ejs = require('ejs')
    var app = express();
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var http = require('http');
    var path = require('path');

    var controller = new(require('./controller/handler.js'))();
    console.log(controller);

    //set the port, check if a env port is set; if not use the said port passed as a argument
    app.set('port', process.env.PORT || port);

    //location of the view fielss
    app.set('views', path.join(__dirname, 'views'));

    //setting up the rendering engine
    app.set('view engine', 'ejs');

    //add methods to obtain request body
    app.use(bodyParser());

    //oveeride http methods with express version of the same
    app.use(methodOverride());

    //static file path to serve static files
    app.use(express.static(path.join(__dirname, 'public')));

    //routing based on diffrent endpoint
    app.get('/', function (req, resp) {
        console.log('Serving Index Page');
        resp.render('index');
    });

    //bootstrap the db connection
    var db = new(require('./db/MongoConnector.js'))()
    db.init();

    app.get('/menu', function (req, res) {
        controller.getMainMenu(req, res, db);
    });
    
    app.get('/form', function (req, res) {
        controller.getMainForm(req, res, db);
    });
    
    app.post('/edit', function (req, res) {
        controller.getMainFormEdit(req, res, db);
    });
    
    app.post('/save', function (req, res) {
        controller.save(req, res, db);
    });
    
    app.post('/update', function (req, res) {
        controller.update(req, res, db);
    })

    //create server
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
}


var tms = new TMS();
tms.launchServer(3000);