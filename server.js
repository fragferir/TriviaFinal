const express  = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session  = require('express-session');
const bcrypt   = require('bcrypt');
const port = process.env.PORT        || 3000;
const db   = process.env.MONGODB_URI || 'mongodb://localhost/TRIVIAP';
const app = express();
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose
        .connect(db, { 
                      useNewUrlParser: true 
                      })
        .then(() => {
                     console.log(`Base de datos conectada en ${db}`);
                     })
        .catch(err => console.error(`Connection error ${err}`));
const Usuario = require('./modelos-PRU/Usuario');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy((username, password, done) => {
                                                              Usuario.findOne({ username: username }, (err, user) => {
                                                              if (err) return done(err);
                                                              if (!user) return done(null, false);
                                                              bcrypt.compare(password, user.password, (err, res) => {
                                                              if (err) throw err;
                                                              if (!res) return done(null, false);
                                                              else return done(null, user);
                                                              });
                                                              });
                                                              }));
passport.serializeUser((user, done) => {
                                        done(null, user._id);
                                        });
passport.deserializeUser((id, done) => {
                                        Usuario.findById(id, (err, user) => {
                                                                             if (err) return done(err);
                                                                             done(null, user);
                                                                             });
                                        });

app.use(session({
                 secret: 'app secret',
                 resave: false,
                 saveUninitialized: false
                 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'pug');
app.set('views', './pugs');
const indexRouter    = require('./routes/index');
const userRouter     = require('./routes/api/usuario');
const questionRouter = require('./routes/api/pregunta');
const answerRouter   = require('./routes/api/respuesta');
app.use('/', indexRouter);
app.use('/api', userRouter);
app.use('/api', questionRouter);
app.use('/api', answerRouter);
app.listen(port, () => {
                        console.log(`Base de datos situada en el puerto ${port}`);
                        });
