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
              res.redirect(`/tickets/user/${ticket._id}`);
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






// SHOW
app.get("/tickets/user/:id", function (req, res) {
  var currentUser = req.user;
  Ticket.findById(req.params.id).populate('evaluations').lean()
      .then(ticket => {
          res.render("tickets-show-user", { ticket, currentUser });  
      })
      .catch(err => {
          console.log(err.message);
      });
});

// SHOW
app.get("/tickets/scribe/:id", function (req, res) {
    var currentUser = req.user;
    Ticket.findById(req.params.id).populate('evaluations').lean()
        .then(ticket => {
            res.render("tickets-show-scribe", { ticket, currentUser });  
        })
        .catch(err => {
            console.log(err.message);
        });
  });

// PROCESSED
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




}