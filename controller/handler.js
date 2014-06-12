//this module acts as a intermediatory between the requests & the db 
//any transformation on busineess check of data must happen here

var Controller = function () {
    

}


module.exports = Controller;

//fetch a list of all the tickets and format as a left menu
Controller.prototype.getMainMenu = function (req, res, db) {
    console.log('Getting Main Menu ' );
    //    console.log(this.db.getTickets);
    db.getTickets(function (err, tickets) {
        res.render('mainmenu', {
            data: tickets,
            err: err
        });
    });
}


//get the main ticket entry form
Controller.prototype.getMainForm = function (req, res, db) {
    console.log('Getting Main Form ' );
    //    console.log(this.db.getTickets);
    res.render('mainview', {
        data: null,
        err: null
    });
   
}


//get the ticket for editing
Controller.prototype.getMainFormEdit=function (req, res, db) {
    console.log('Getting Main Form Edit' + req.body.id);
    if(req.body.id) {
        db.getTicketByID(req.body.id, function(err, ticket){
            console.log(ticket);
            res.render('mainview', {
                data: ticket,
                err: err
            });
        });
    }
}


//save the ticket
Controller.prototype.save=function (req, res, db) {
    console.log('Saving Ticket' + req.body.id);
    if(req.body.ticket) {
        db.saveTicket(req.body.ticket, function(err, ticket){
            console.log(ticket);
            res.send( );
        });
    }
}


//update the saved ticket
Controller.prototype.update=function (req, res, db) {
    console.log('Getting Main Form Edit' + req.body.id);
    if(req.body.ticket) {
        db.updateTicket(req.body.id , req.body.ticket, function(err, ticket){
            console.log(ticket);
            res.send( );
        });
    }
}
//
//var c = new Controller();
//c.getMainMenu();