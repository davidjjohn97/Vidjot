const express= require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport=require('passport');
const {ensureAuthenticated} = require('../helpers/auth')


//Load User MOdel
require('../models/User');
const User = mongoose.model('users');

///LOad Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');


//Idea Index PAge

router.get('/',ensureAuthenticated, (req, res) => {
  // User.find({name:req.body.name})
  //  console.log(req.body);
   // console.log(User.name);
    Idea.find({user:loggedtoken})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
});


//Add  Idea Form
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//Edit  Idea Form

//console.log(sid);
router.get('/edit/:id',ensureAuthenticated, (req, res) => {
    
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        })
});



//ADD Process Form

router.post('/',ensureAuthenticated, (req, res) => {
   
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'PLease Add Title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'PLease Add Details' });
    }
     if (errors.length > 0) {

       
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
     else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user:loggedtoken
        }
        console.log(newUser);
        new Idea(newUser)
            .save()
            .then(idea => {

        req.flash('success_msg','Video Idea Added');
                res.redirect('/ideas');
            })

    }
});



//EDIT/UPDATE PROCESS FORM
router.put('/:id',ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(then => {

        req.flash('success_msg','Video Idea Updated');
                    res.redirect('/ideas');
                });


        });
});

//Delete Idea 
router.delete('/:id',ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() =>{
        req.flash('success_msg','Video Idea Removed');
        res.redirect('/ideas');
    });
});


module.exports=router;