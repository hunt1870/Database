var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');

var user = require('./models/user');

mongoose.connect("mongodb://localhost/database");

app.use(flash());

app.use(methodOverride("_method"));

var urlencodedParser = bodyParser.urlencoded({extended:false});

app.set('view engine','ejs');

app.use('/assets',express.static(__dirname + '/public'));

app.use(require('express-session')({
    secret:"this time its over",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.get('/',function(req,res){
    res.render('index');
});

app.get('/main',isLoggedIn, function (req, res) {
    user.find(function (err, Users) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('main', { user: Users ,currentUser:req.user});
        }
    });
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.post('/register',urlencodedParser, function(req,res) {
    user.register(new user({ username: req.body.username, roll_no: req.body.roll_no, city: req.body.city, phone_no: req.body.phone_no }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/register');
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome" + " " + user.username);
                res.redirect("/main");
            });
        }
    });
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', urlencodedParser, passport.authenticate("local", 
    {
    successRedirect: "/main",
    failureRedirect: "/login"
    }), function(req, res){
});

app.get('/logout',function(req,res){
    req.logOut;
    req.flash("success","logged u out");
    res.redirect("/");
});

app.get('/main/:id/edit',function(req,res){
    user.findById(req.params.id,function(err,foundUser){
        res.render('edit',{user:foundUser});
    });
});

app.put('/main/:id', checkUserOwnership, urlencodedParser,function(req,res){
    user.findByIdAndUpdate(req.params.id,{username:req.body.username,roll_no:req.body.roll_no,city:req.body.city,phone_no:req.body.phone_no},function(err,updateUser){
        if(err){
            console.log(err);
            req.flash("error","Error while updating");
            res.redirect('/main');
        }else{
            req.flash("success","Your data successfully updated");
            res.redirect('/main');
        }
    });
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "U need to login first");
        res.redirect("/");
    }
};

function checkUserOwnership(req,res,next){
    if(req.isAuthenticated()){
        user.findById(req.params.id,function(err,foundUser){
            if(err){
                req.flash("error","Data not found");
            }else{
                if(foundUser._id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You dont have the permission to do that");
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash("error","You need to login to do that");
        res.redirect("back");
    }
}

app.listen(3001,function(){
    console.log('server starts');
});//put method and update button main page mein rheta or ek middleware bhi