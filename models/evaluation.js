const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

const EvaluationSchema = new Schema({
  description: { type: String, required: true },
  author : { type: Schema.Types.ObjectId, ref: "User", required: true },
  profile : { type: Schema.Types.ObjectId, ref: "User", required: true },
  evaluations: [{type: Schema.Types.ObjectId, ref: "Evaluation"}] 

});

// Always populate the author field
EvaluationSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))
    .pre('findOne', Populate('evaluations'))
    .pre('find', Populate('evaluations'))
    .pre('findOne', Populate('profile'))
    .pre('find', Populate('profile'))

module.exports = mongoose.model("Evaluation", EvaluationSchema);