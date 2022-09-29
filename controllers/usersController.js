const User  = require('../models/user');

module.exports = {
    index: (req, res, next) => {
        User.find().then(
            users => {
                res.locals.users = users;
                next();
            }
        ).catch(
            error => {
                console.log(`Error in getting user data: ${error.message}`);
                next(error);
            }
        )
    }, 
    indexView: (req, res) => {
        res.render('users/index', {flashMessages: {
            success: 'Users data loaded!'
        }});
    },
    new: (req, res) => {
        res.render('users/new');
    },
    validate: (req, res, next) => {
        req.sanitizeBody('email').normalizeEmail({
            all_lowercase: true
        }).trim();
        req.check('email', 'email is invalid').isEmail();
        req.check('userName', 'userName is not added').notEmpty();
        req.getValidationResult().then(
            error => {
                if(!error.isEmpty()){
                    let message = error.array().map(e => e.msg);
                    req.skip = true;
                    req.flash('error', message.join(' and '));
                    res.locals.redirect = '/users/new';
                    next();
                }else{
                    next();
                }
            }
        );
    },
    create: (req, res, next) => {
        if (req.skip){
            next();
        }else{
            let userParams = {
                userName: req.body.userName,
                email: req.body.email,
                money: 0,
            }
            let newUser = new User(userParams);
            User.register(newUser, req.body.password, (error, user) => {
                if(user){
                    req.flash('success', `${user.userName}'s account created successfully!`);
                    res.locals.redirect='/users';
                    next();
                }else{
                    req.flash('error', `Failed to create user account becouse: ${error.message}.`);
                    res.locals.redirect='/users/new';
                    next();
                }
            });
        }
    },
    redirectView: (req, res) => {
        let redirectPath = res.locals.redirect;
        res.redirect(redirectPath);
    }
}