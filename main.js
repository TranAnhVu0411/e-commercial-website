// install nodemon
// https://stackoverflow.com/questions/63659803/problem-installing-nodemon-globally-on-macos-mojave

const express = require('express'),
mongoose = require('mongoose'),
layouts = require('express-ejs-layouts'),
methodOverride = require('method-override'),
expressSession = require('express-session'),
passport = require('passport'),
cookieParser = require('cookie-parser'),
connectFlash = require('connect-flash'),
// https://stackoverflow.com/questions/56733975/express-validator-error-expressvalidator-is-not-a-function
expressValidator = require('express-validator'), // npm install express-validator@5.3.0
router = require('./routes/index');

const app = express();
app.set('port', process.env.PORT||3000);

mongoose.connect(
    'mongodb://localhost:27017/e_commercial_db',
    {useNewUrlParser: true}
);
mongoose.Connection;
mongoose.Promise = global.Promise;

app.use(layouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded(
    {extended: false}
));
app.use(express.json());

app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));

app.use(cookieParser('secret_passcode'));
app.use(expressSession({
    secret: 'secret_passcode',
    cokie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(connectFlash());

app.use(expressValidator());

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
})

app.use('/', router);

const User = require('./models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(app.get('port'), () => {
    console.log(`Listening to http://localhost:${app.get('port')}`);
})
