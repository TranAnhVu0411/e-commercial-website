const Saler = require('../models/saler');
const User = require('../models/user');

module.exports = {
    index: (req, res, next) => {
        Saler.find().then(salers => {
            res.locals.salers = salers;
            next();
        }).catch(error => {
            console.log(`Error fetching salers: ${error.message}`);
        });
    },
    indexView: (req, res) => {
        res.render('salers/index', {flashMessages: {
            success: 'Loaded all salers!'
        }});
    },
    new: (req, res) => {
        res.render('salers/new');
    },

    validate: (req, res, next) => {
        req.sanitizeBody('email').normalizeEmail({
            all_lowercase: true
        }).trim();
        req.check('email', 'email is invalid').isEmail();
        req.check('name', 'name is not added').notEmpty();
        req.check('shopAddress', 'shop address is not added').notEmpty();
        req.check('accountName', 'account name is not added').notEmpty();
        req.check("identityNumber", "identity number is invalid")
        .notEmpty()
        .isInt()
        .isLength({
            min: 9,
            max: 9
        }).equals(req.body.identityNumber);

        req.check("accountNumber", "account number is invalid")
        .notEmpty()
        .isInt()
        .isLength({
            min: 9,
            max: 9
        })
        .equals(req.body.accountNumber);

        req.getValidationResult().then(
            error => {
                if(!error.isEmpty()){
                    let message = error.array().map(e => e.msg);
                    req.skip = true;
                    req.flash('error', message.join(' and '));
                    res.locals.redirect = '/salers/new';
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
            User.findOne({email: req.body.email}).then(
                user => {
                    if (user === null){
                        res.locals.redirect = '/salers/new';
                        req.flash('error', "can't find user account that have this email");
                        next();
                    }else{
                        let newSaler = Saler({
                            email: req.body.email,
                            name: req.body.name,
                            shopAddress: req.body.shopAddress,
                            bankAccount: {
                                accountName: req.body.accountName,
                                identityNumber: req.body.identityNumber,
                                accountNumber: req.body.accountNumber,
                                bank: req.body.bank,
                                region: req.body.region
                            }
                        });
                        newSaler.save().then(
                            saler => {
                                res.locals.saler = saler;
                                res.locals.redirect = '/salers';
                                next();
                            }
                        ).catch(
                            error => {
                                res.locals.redirect = '/salers/new';
                                console.log(`Error fetching when create saler ${error.message}`);
                                next(error);
                            }
                        ); 
                    }
                }
            ).catch(
                error => {
                    res.locals.redirect = '/salers/new';
                    console.log(`Error fetching when check user email ${error.message}`);
                    next(error);
                }
            )
        }
    },
    redirectView: (req, res) => {
        let redirectPath = res.locals.redirect;
        res.redirect(redirectPath);
        req.flash('success', 'create success');
    }
}