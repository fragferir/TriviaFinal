const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
});
const Pregunta = mongoose.model('Question', QuestionSchema);
module.exports = Pregunta;
