const Ticket = require("../models/ticket");
const User = require("../models/user");
const Evaluation = require("../models/evaluation");

module.exports = (app) => {
  app.get("/tickets/new", (req, res) => {
    let currentUser = req.user;
    Ticket.find({}).populate("author")
        .then(tickets => {
            tickets = JSON.parse(JSON.stringify(tickets))
            res.render("tickets-new", { tickets, currentUser });
        })
        .catch(err => {
            console.log(err.message);
        });

// CREATE
app.post("/tickets/new", (req, res) => {
  if (req.user) {
      var ticket = new Ticket(req.body);
      ticket.author = req.user._id;
      ticket.profile = req.user._id;
      ticket.evaluated = false 

      ticket
          .save()
          .then(ticket => {
              return User.findById(req.user._id);
          })
          .then(user => {
              user.tickets.unshift(ticket);
              user.save();
              // REDIRECT TO THE NEW POST
              res.redirect(`/tickets/${ticket._id}/user`);
          })
          .catch(err => {
              console.log(err.message);
          });
  } else {
      return res.status(401); // UNAUTHORIZED
  }
});
});

  // SCRIBE QUEUED
  app.get("/tickets/queued/scribe", (req, res) => {
    let currentUser = req.user;
    console.log(req.cookies);
    Ticket.find({}).populate("author")
    Ticket.find({ evaluated: false }).lean()
        .then(tickets => {
            tickets = JSON.parse(JSON.stringify(tickets))
            res.render("tickets-queued-scribe", { tickets, currentUser });
        })
        .catch(err => {
            console.log(err.message);
        });
});


  // USER QUEUED  
  app.get("/tickets/queued/user", (req, res) => {
    let currentUser = req.user;
    console.log(req.cookies);
    Ticket.find({}).populate("author")
    Ticket.find({ profile: currentUser._id, evaluated: false }).lean()
        .then(tickets => {
            tickets = JSON.parse(JSON.stringify(tickets))
            res.render("tickets-queued-user", { tickets, currentUser });
        })
        .catch(err => {
            console.log(err.message);
        });
});






// SHOW USER
app.get("/tickets/:id/user", function (req, res) {
  var currentUser = req.user;
  Ticket.findById(req.params.id).populate('evaluations').lean()
      .then(ticket => {
          res.render("tickets-show-user", { ticket, currentUser });  
      })
      .catch(err => {
          console.log(err.message);
      });
});

// SHOW SCRIBE
app.get("/tickets/:id/scribe", function (req, res) {
    var currentUser = req.user;
    Ticket.findById(req.params.id).populate('evaluations').lean()
        .then(ticket => {
            res.render("tickets-show-scribe", { ticket, currentUser });  
        })
        .catch(err => {
            console.log(err.message);
        });
  });

// PROCESSED USER
app.get("/user/:profile", function (req, res) {
  var currentUser = req.user;
  Ticket.find({ profile: currentUser._id, evaluated: true }).lean()
      .then(tickets => {
          res.render("tickets-queued-user", { tickets, currentUser });
      })
      .catch(err => {
          console.log(err);
      });
});

// PROCESSED SCRIBE
app.get("/scribe/:profile", function (req, res) {
    var currentUser = req.user;
    Evaluation.find({ profile: currentUser._id }).lean()
        .then(tickets => {
            res.render("tickets-queued-scribe", { tickets, currentUser });
        })
        .catch(err => {
            console.log(err);
        });
  });



// TICKETS DELETE
app.get("/tickets/:id/delete", function (req, res) {
    var currentUser = req.user;
    Ticket.findByIdAndDelete(req.params.id)
        .then(ticket => {
            res.redirect("/tickets/queued/user");
        })
        .catch(err => {
            console.log(err.message);
        });
  });



}

