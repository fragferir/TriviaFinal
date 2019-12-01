const mongoose = require('mongoose');
const AnswerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isRight: { type: Boolean, default: false },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
});
const Respuesta = mongoose.model('Answer', AnswerSchema);
module.exports = Respuesta;
