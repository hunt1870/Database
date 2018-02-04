var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var urlencoded = bodyParser.urlencoded({extended:false});

app.set('view engine','ejs');//always check file in views folder

app.use('/assets',express.static(__dirname + '/public'));

app.use('/',function(req,res,next){
    console.log('Request Url:' + req.url);
    next();
});


app.get('/',function(req,res) {
    res.send('<html><head><link href=assets/style.css type=text/css rel=stylesheet /></head><body><h1>Hello World!</h1></body></html>')
});

app.get('/html',function(req,res){
    res.render('index');
});

app.get('/json',function(req,res){
    res.json({firstname : 'Raman',lastname : 'deep'})
});

app.get('/:id',function(req,res){
    res.render('person',{ID:req.params.id,Qstr:req.query.qstr});
});//url-/id?qstr=any val

app.get('/:name/:id',function(req,res){
    res.send('<html><body><h1>' + req.params.name + ':' + req.params.id
    + '</h1></body></html>');
});

app.post('/html',urlencoded,function(req,res){
    res.send('Thankyou');
    console.log(req.body.firstname);
    console.log(req.body);
});

var port = process.env.PORT || 3000;

app.listen(port,function() {
    console.log('server starts');
});