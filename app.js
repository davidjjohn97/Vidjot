const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path')
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session =require('express-session')
const bodyParser = require('body-parser');
const passport=require('passport');
const mongoose = require('mongoose');

const app = express();

//LOad ROutes

const ideas =require('./routes/ideas');
const users =require('./routes/users');

//PAssport Config

require('./config/passport')(passport);
//DB Config
const db = require('./config/database');


//mAP GLOBAL PROMISE -GET RID OF WARNING
mongoose.Promise = global.Promise;
//Connect to Mongoose
mongoose.connect(db.mongoURI, {
    useMongoCLient: true
})
    .then(() => console.log('Mongo DB CONNECTED....'))
    .catch(err => console.log(err));





//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//static folder
app.use(express.static(path.join(__dirname,'public')));//sets publicfolder to
                                                    // be the express static folder

//methodoveride middleware
app.use(methodOverride('_method'));

//express session middleware

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));
app.use(flash());
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//GLobL variables

app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user =req.user||null;
    next();

});

//How Middleware works 
/*app.use(function(req,res,next){
   // console.log(Date.now());
    req.name='David';
    next();
});
*/


//Index Route
app.get('/', (req, res) => {
    const title = 'WelcomE';
    res.render('index', {
        title: title
    });             //res.send(req.name);
    //Sends TO server
});

//About  Route
app.get('/about', (req, res) => {
    res.render('about');
});




    //use routesss
app.use('/ideas',ideas);
app.use('/users',users);
const port =process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);// = console.log('Server started on port'+port);

});