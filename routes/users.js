const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport=require('passport');

var loggedtoken =null;

//Load User MOdel
require('../models/User');
const User = mongoose.model('users');


//User LOgin Route
router.get('/login', (req, res) => {
    res.render('users/login');
});
//User REGISTER Route
router.get('/register', (req, res) => {
    res.render('users/register');
});


//Login Form
router.post('/login',(req,res,next)=>{
   
   User.findOne({ email:req.body.email})
  .then(user => {
    /*if (user) {
       console.log(user);*/
       global.loggedtoken=user.token;
 /*   }
    else{
        console.log("not");
    }*/
});

    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req,res,next);

});



//Register Form POst
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password1 != req.body.password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    if (req.body.password1.length < 4) {
        errors.push({ text: 'Passwords must be atleast 4 charachters' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password1: req.body.password1,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('login');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password1,
                        token:Math.random().toString(36).substring(7)
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are registered and can login');
                                    console.log(newUser.token);
                                    res.redirect('login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });

                        });
                    });


                }
            })

    }

});

//LOgout User
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are Logged Out');
    res.redirect('/users/login');
    
});

module.exports = router;
