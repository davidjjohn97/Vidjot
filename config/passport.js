const LocalStrategy =require('passport-local').Strategy;
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
require('../models/User');

var sid=null;

//LOad User MOdel
const User =mongoose.model('users');
module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:"email"},(email,
        password,done)=>{
            //match user
      User.findOne({
          email:email
        }).then(user => {
            if(!user){
                return done (null, false ,{message:'No User Found'});
            }


            //MAtch PAssword
            bcrypt.compare(password,user.password,(err, isMatch) =>{
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null,false,{message:'Password Incorrect'})
                }
            })
        }) 
      }));
      passport.serializeUser(function(user,done){
    global.sid=user.id;
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(null,user.id);
    });
    
});


    }
