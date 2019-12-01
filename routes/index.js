const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();
const Usuario = require('../modelos-PRU/Usuario');
const Pregunta = require('../modelos-PRU/Pregunta');
const Respuesta = require('../modelos-PRU/Respuesta');


router.post('/login',
                     passport.authenticate('local', { failureRedirect: '/' }),
                     (req, res, next) => {
                                          res.redirect('/');
                                          });

router.get('/login', (req, res) => {
                                    res.render('login');
                                    });
router.get('/register', (req, res) => {
                                       res.render('register');
                                       });
router.post('/register', (req, res) => {
                                        const user = new Usuario({
                                        username: req.body.username,
                                        password: req.body.password,
                                        firstName: req.body.firstName,
                                        lastName: req.body.lastName,
                                        email: req.body.email
                                        });
console.log(user) 
bcrypt.genSalt(10, (err, salt) => {
                                   bcrypt.hash(user.password, salt, (err, hash) => {
                                                                                    if (err) throw err;
                                                                                    user.password = hash;
                                                                                    user.save(err => {
                                                                                                      if (err) throw err;
                                                                                                      res.redirect('/');
                                                                                                      });
                                                                                    });
                                   });
});

router.get('/unauthorized', (req, res) => {
                                           res.render('unauthorized');
                                           });

router.get('/play',
  require('connect-ensure-login').ensureLoggedIn('/unauthorized'),
  (req, res) => {
    Pregunta.find().populate('answers').exec((err, questions) => {
      if (err) throw err;
      const random = Math.floor(Math.random() * questions.length);
      res.render('play', { question: questions[random], user: req.user });
    });
});

router.get('/question',
  require('connect-ensure-login').ensureLoggedIn('/unauthorized'),
  (req, res) => {
    res.render('question', { user: req.user });
});

router.post('/question', (req, res) => {
  const question = new Pregunta({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.question
  });
  const answerA = new Respuesta({
    title: req.body.answerA,
    isRight: false,
    question: question._id
  });
  const answerB = new Respuesta({
    title: req.body.answerB,
    isRight: false,
    question: question._id
  });
  const answerC = new Respuesta({
    title: req.body.answerC,
    isRight: false,
    question: question._id
  });
  const answerD = new Respuesta({
    title: req.body.answerD,
    isRight: false,
    question: question._id
  });
  switch (req.body.answers) {
    case 'a':
      answerA.isRight = true;
      break;
    case 'b':
      answerB.isRight = true;
      break;
    case 'c':
      answerC.isRight = true;
      break;
    case 'd':
      answerD.isRight = true;
      break;
    default:
      break;
  }
  question.answers.push(answerA);
  question.answers.push(answerB);
  question.answers.push(answerC);
  question.answers.push(answerD);
  question.save(err => {
                        answerA.save();
                        answerB.save();
                        answerC.save();
                        answerD.save();
    res.redirect('/question');
  });
});

router.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

module.exports = router;
