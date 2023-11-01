const express = require('express');
const path = require('path');
const userRouter = require('./routes/user');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const db = require('./dbClient');
db.on('error', (err) => {
  console.error(err);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Définition de la route pour les utilisateurs
app.use('/', userRouter);
app.use('/add',userRouter);

app.use('/user', userRouter);


const server = app.listen(port, (err) => {
  if (err) throw err;
  console.log('Server listening on port ' + port);
});

module.exports = server;
