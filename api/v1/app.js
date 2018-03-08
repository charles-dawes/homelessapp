var restify = require('restify');
const {Pool, Client} = require('pg');
var $ = require('jquery');



const pool = new Pool({
  user: 'homelessadmin',
  host: 'homelessapp.comf0z7yu2yl.us-east-2.rds.amazonaws.com', 
  database: 'homeless_app', 
  password: 'GreenChicken18', 
  port: 5432,
});

var server = restify.createServer();

//processing to happen before running any routes 
server.use(function(req, res, next) {
    //maybe do JWT processing here?
    
    return next(); 
});




//API paths
var PATH = "" //instantiate path variable
PATH = "/hello/:name"
server.get({path: PATH, version: '1.0.0'}, respond);
server.head({path: PATH, version: '1.0.0'}, respond);

PATH = "/hello/:name"
server.get({path: PATH, version: '2.0.0'}, respondWithDateTime);
server.head({path: PATH, version: '2.0.0'}, respondWithDateTime);

PATH = '/categories/get'
server.get({path: PATH, version: '1.0.0'}, getCategories)
server.head({path: PATH, version: '1.0.0'}, getCategories)

PATH = '/categories/get/:ID'
server.get({path: PATH, version: '1.0.0'}, getCategoryById)
server.head({path: PATH, version: '1.0.0'}, getCategoryById)

PATH = '/users/get/:ID'
server.get({path: PATH, version: '1.0.0'}, getUserById);
server.head({path: PATH, version: '1.0.0'}, getUserById);


//Route not found, use the method below to log such requests then the "return cb()"
//line will handle returning the error message 
server.on('NotFound', function (req, res, err, cb) {
  //logging stuff
  return cb();
});



//functions to call from API
function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function respondWithDateTime(req, res, next){
    res.send('Hello ' + req.params.name + ".  It is " + Date())
}

function getCategories(req, res, next){
  //select all active categories
  pool.query('SELECT * from public.get_categories()', (err, result) => {
    
    res.send(result.rows);
  })
}

function getCategoryById(req, res, next){
  pool.query('SELECT * from public.get_single_category('+req.params.ID+')', (err, result) => {
    res.send(result.rows);
  })
}


function getUserById(req, res, next){
  pool.query('SELECT * from public.get_user('+req.params.ID+')', (err, result) => {
    res.send(result.rows);
    
  })
}

server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});