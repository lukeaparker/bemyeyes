// models/ticket.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

const TicketSchema = new Schema({
  imageName: { type: String, required: true },
  url: { type: String, required: true },
  context: { type: String, required: true },
  author : { type: Schema.Types.ObjectId, ref: "User", required: true },
  profile : { type: Schema.Types.ObjectId, ref: "User", required: true },
  evaluations: [{ type: Schema.Types.ObjectId, ref: 'Evaluation' }],
  evaluated: [{type: Boolean, required: true, default: false}],
})

// Always populate the author field
TicketSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

    .pre('findOne', Populate('profile'))
    .pre('find', Populate('profile'))

module.exports = mongoose.model("Ticket", TicketSchema);