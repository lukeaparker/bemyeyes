const Evaluation = require('../models/evaluation')
const Ticket = require('../models/ticket')
const User = require("../models/user");


module.exports = function (app) {
  // CREATE Evaluation
  app.post("/tickets/:ticketId/evaluations", function (req, res) {
      const evaluation = new Evaluation(req.body);
      evaluation.author = req.user._id;
      evaluation.profile = req.user._id;

      evaluation
          .save()
          .then(evaluation => {
              return Promise.all([
                  Ticket.findByIdAndUpdate(req.params.ticketId, {evaluated: true })
              ]);
          })
          .then(([ticket, user]) => {
              ticket.evaluations.unshift(evaluation);
              return Promise.all([
                  ticket.save()
              ]);
          })
          .then(ticket => {
              res.redirect(`/tickets/scribe/${req.params.ticketId}`);
          })
          .catch(err => {
              console.log(err);
          });
  });
};