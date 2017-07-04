// server.js

// DEPENDENCIES AND SETUP
// ===============================================

var express = require('express'),
  app = express(),
  port = Number(process.env.PORT || 3000),
  bodyParser = require('body-parser'); // Middleware to read POST data

// Set up body-parser.
// To parse JSON:
app.use(bodyParser.json());
// To parse form data:
app.use(bodyParser.urlencoded({
  extended: true
}));

// DATABASE
// ===============================================

// Setup the database.
var Datastore = require('nedb');
var db = new Datastore({
  filename: 'assetsdata.db', // provide a path to the database file 
  autoload: true, // automatically load the database
  timestampData: true // automatically add and manage the fields createdAt and updatedAt
});


// ROUTES
// ===============================================
app.use('/', express.static('app'));

// Define the home page route.
/*app.get('/', function(req, res) {
   res.sendFile(__dirname + '/app/index.html');
});*/

// GET all data.
// (Accessed at GET http://localhost:3000/getData)
app.get('/getData', function(req, res) {
  db.find({}).sort({
    updatedAt: -1
  }).exec(function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});

// GET a data.
//(Accessed at GET http://localhost:3000/data/data_id)
app.get('/getData/:id', function(req, res) {
  var data_id = req.params.id;
  db.findOne({
    _id: data_id
  }, {}, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});


// POST a new data.
// (Accessed at POST http://localhost:3000/saveData)
app.post('/saveData', function(req, res) {
  var data = req.body;
  console.log(data);
  db.insert(data, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});

// START THE SERVER
// ===============================================

app.listen(port, function() {
  console.log('Listening on port ' + port);
});