/**
 * Module dependencies.
 */
GLOBAL.plaid = require('plaid');
var express = require('express'), routes = require('./routes');
var app = module.exports = express.createServer();
//var app = express();
GLOBAL.Parse = require('parse/node').Parse;
//var http = require('http').Server(Express);
var io = require('socket.io')(app);
// Configuration
io = io.listen(app);
var myplaid = require('./routes/plaid');
var mySocket = require('./routes/vsock');

Parse.initialize("4GZVowEV6lVMrY428JCs9mPWkGAGlDwD16ZoARZA", "sKWTGbb3gkY5rj2UNGn8Or4MEa0lF1AoQ1EWMTDW");

//Parse.initialize("Your App Id", "Your JavaScript Key");

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use( express.cookieParser() );
    app.use(app.router);
    app.use(express.session({ secret: 'my_precious' }));
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
    res.render('index2Jade', { user: req.user });
});

app.get('/login', function(req, res){
    res.render('login-register', { user: req.user });
});

app.post('/login', function(req,res){
    var username = req.body.username;
    console.log(username);

    var password = req.body.password;

    console.log(password);
    Parse.User.logIn(username, password, {
        success: function(user) {
            res.redirect('/charities');
        },
        error: function(user, error) {
            res.redirect('/login');
        }
    });
});

app.get('/plaid-login', function(req, res) {
    res.render('plaid-login', {user: req.user});
});

app.get('/charities', function(req, res){
    res.render('charities', { user: req.user });
    io.emit('loginevent', { for: 'everyone', sessionid: Parse.User.current() });
    //io.sockets.emit("data",{data:"This is handle by every client"})
});


app.post('/register', function(req, res){
    var username = req.body.username;
    console.log(username);

    var password = req.body.password;
    var email = req.body.email;
    var user = new Parse.User();

    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

});

app.post('/charities', function(req, res) {
    
});

app.get('/donations', function(req, res){
    res.render('donations', { user: req.user });
    
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/bank', function(req, res){
    res.render('plaid-login', {user: req.user});

});

app.get('/ping', routes.ping);

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.listen(3000, function() {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings);
});