/*
Contains methods to initalize connection and perform other operations wrt ticket. 

*/
var MongoConnector = function (host, port) {

    this.mongoose = require('mongoose');
    var Schema = this.mongoose.Schema;


    //list of users this can be out into a collection and retrived
    this.user = ['Amar', 'Becky', 'Caran', 'Dave'];

    //list of admin 
    this.admin = ['Steve', 'Bill', 'Lesper'];


    //list of status 
    this.status = ['Open', 'Closed', 'In-Progress'];


    //schema structure to save the ticket. each ticket is a new document 
    this.TMS = new Schema({
        user_id: String,
        admin_name: String,
        status: String,
        comments: String,
        summary: String
    });





}

MongoConnector.prototype.init = function () {
    //regester model

    console.log('Initalizing DB Connection');
    try {
        if (!this.mongoose.model('tms'))
            this.mongoose.model('tms', this.TMS);
    } catch (error) {
        this.mongoose.model('tms', this.TMS);
    }


    //connect to the local mongo server
    this.mongoose.connect('mongodb://localhost/tms');

}
module.exports = MongoConnector;

//uppdates a selected ticket and saves the value

MongoConnector.prototype.updateTicket = function (tickID, ticket, callback) {
    var tms = this.mongoose.model('tms');
    this.getTicketByID(tickID, function (err, savedTicket) {
        console.log('Got Saved Ticket.. Updating ' + JSON.stringify(ticket));
        savedTicket.user_id = this.user[ticket.userid];
        savedTicket.admin_name = this.admin[ticket.adminName];
        savedTicket.status = this.status[ticket.status];
        savedTicket.comments = ticket.comment;
        savedTicket.summary = ticket.summary;
        savedTicket.save(function (err, res) {
            callback(err, res)
        });
    }.bind(this));
}


//creates a new ticket document
MongoConnector.prototype.saveTicket = function (ticket, callback) {
    var tms = this.mongoose.model('tms');

    var t = new tms({
        user_id: this.user[ticket.userid],
        admin_name: this.admin[ticket.adminName],
        status: this.status[ticket.status],
        comments: ticket.comment || '',
        summary: ticket.summary || ''
    });
    t.save(function (err, res) {
        callback(err, res)
    });
}


//gets a particulat ticket by its _ID field. this is a auto genratated BSON id by the mongo sustem
MongoConnector.prototype.getTicketByID = function (tickID, callback) {
    var tms = this.mongoose.model('tms');

    tms.findById(tickID, function (err, res) {
        callback(err, res);
    });
}


//get all the tickets listed. used to create menu
MongoConnector.prototype.getTickets = function (callback) {
    var tms = this.mongoose.model('tms');

    tms.find({}, function (err, res) {
        callback(err, res);
    });
}

//var mc = new MongoConnector();
//mc.init();
//mc.saveTicket({
//    userid: 1,
//    adminName: 1,
//    status: 'Open',
//    comment: ''
//
//}, function (err, res) {
//    console.log(res.id);
//    mc.updateTicket(res.id, {
//        userid: 2,
//        adminName: 3,
//        status: 'Open',
//        comment: '',
//        summary: 'Something Not Working'
//
//    }, function (err, res) {
//        console.log(err);
//        console.log(res);
//    })
//});

//mc.getUsers();
//mc.