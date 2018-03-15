var restify = require('restify');
var restifyValidation = require('node-restify-validation');
var jwt = require('jsonwebtoken');
var pgp = require('pg-promise')();
var jsSHA = require("jssha");


const con = {
  user: '',
  host: '', 
  database: '', 
  password: '', 
  port: ,
};

const db = pgp(con);





var server = restify.createServer();

//processing to happen before running any routes 
server.use(function(req, res, next) {
    //maybe do JWT processing here?
    
    return next(); 
});
server.use(restify.plugins.bodyParser({mapParams: true}));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: false }));
server.use(restify.plugins.fullResponse());
server.use(restifyValidation.validationPlugin({
  errorsAsArray: false,
  errorHandler: restify.InvalidArgumentError
}));


jwt.verifyToken = function(reqToken){
  return verifyToken(reqToken);
};

var verifyToken = function(reqToken){
  if (token === reqToken){
    return true;
  } else {
    return false;
  }
  
}


//Route not found, use the method below to log such requests then the "return cb()"
//line will handle returning the error message 
server.on('NotFound', function (req, res, err, cb) {
  //logging stuff
  return cb();
});

 
server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});





//API paths
var PATH = ""; //instantiate path variable
PATH = "/hello/:name";
server.get({path: PATH, version: '1.0.0'}, respond);
server.head({path: PATH, version: '1.0.0'}, respond);

PATH = "/hello/:name";
server.get({path: PATH, version: '2.0.0'}, respondWithDateTime);
server.head({path: PATH, version: '2.0.0'}, respondWithDateTime);

PATH = '/categories/get';
server.get({path: PATH, version: '1.0.0'}, getCategories);
server.head({path: PATH, version: '1.0.0'}, getCategories);

PATH = '/categories/get/:ID';
server.get({path: PATH, version: '1.0.0'}, getCategoryById);
server.head({path: PATH, version: '1.0.0'}, getCategoryById);

PATH = '/categories/create';
server.put({path: PATH, version: '1.0.0',validation:{
  content: {
    category_name: {isRequired: true}
  }
}}, putCreateCategory);

PATH = '/users/get/:ID';
server.get({path: PATH, version: '1.0.0'}, getUserById);
server.head({path: PATH, version: '1.0.0'}, getUserById);


PATH = '/auth/login';
server.post({path: PATH, version: '1.0.0',validation:{
  content: {
    username: {isRequired: true},
    password: {isRequired: true}
  }
}}, userLogin);






//functions to call from API
function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function respondWithDateTime(req, res, next){
    res.send('Hello ' + req.params.name + ".  It is " + Date())
}

function getCategories(req, res, next){
  
  db.any('SELECT * from public.get_categories()')
    .then(function(data){
      res.send(data);
    });
  //select all active categories
  
}

function getCategoryById(req, res, next){
  db.any('SELECT * from public.get_single_category($1)', [req.params.ID])
    .then(function(data){
      res.send(data);
    });
  
}


function getUserById(req, res, next){
  db.any('SELECT * from public.get_user($1)', [req.params.ID])
    .then(function(data){
      res.send(data);
  });
}

function putCreateCategory(req, res, next){
  var exists = false;
  
  db.any('SELECT * from public.get_categories()', (err, result) => {
    for (let i = 0; i < result.rows.length; i++){
      if (result.rows[i].name === req.params.category_name){
          exists = true;
  
      } 
    };
  }).then(console.log(result.rows));

}

function userLogin(req, res, next){
  //console.log(req.params);
  //s.send(req.params);


  var shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.update(req.params.password);
  var hash = shaObj.getHash("HEX");
  const userExist = {
    name: 'get-user',
    text: 'SELECT id from public.users where phone_number = $1::text and password = $2::text limit 1',
    values: [req.params.username, hash],
    rowMode: 'array'
  };

  //console.log(hash);
  db.oneOrNone(userExist)
    .then(user => {
      if (user != null){
        var id = user[0];
        //we were able to verify that the username and password sent to the API match a user in the database
        var token = jwt.sign(req.params.username,  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
        
        const addTokenToUser = {
          name: 'update-token',
          text: 'SELECT post_update_token($1::text, $2::integer)',
          values: [token, id],
          rowMode: 'array'
        };
        var updated = false;
        db.any(addTokenToUser)
          .then(data => {
            var updated = data[0][0];
            if (updated){
              res.send(token);  
            } else {
              res.send('failed ');
            }
            
          });
      } else {
        //invalid credentials
        console.log('no match');
        res.send('invalid credentials');
      }
    });
}

