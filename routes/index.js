
/*
 * GET home page.
 */
exports.index = function(req, res){
    if(Parse.User.current()){
        res.render('index', { title: 'Homepage' });
    }else{
        res.redirect('/login');
    }
};

exports.bank = function(req, res){
    if(Parse.User.current()){
        res.render('plaid-login', { title: 'Bank' });
    }else{
        res.redirect('/login');
    }
}


exports.ping = function(req, res){
    res.send("pong!", 200);
};