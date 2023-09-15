var router = require('express').Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var async = require('async');


var passport = require('passport');
var passportConf = require('../config/passport');

// URl LOGIN

router.get('/login',function(request,response){
    if(request.user) return response.redirect('/home');
    
    response.render('account/login',{message : request.flash('loginMessage')});
});


router.post('/login', passport.authenticate('local-login',{
                                            
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));


// URL Profil

router.get('/profile',function(request,response){
    
  User.findOne({ _id : request.user._id}, function(err,user){
      if(err) return next(err);
      
      response.render('account/profile' ,{user:user});
      
});  
    
});


//URL SIGNUP (inscription)

router.get('/signup',function(request,response){
    
     response.render('account/signup', {errors : request.flash('errors')});
});

router.post('/signup',function(request,response,next){
    
    
    async.waterfall([
        
        function(callback){
            
             var user = new User();
    
    user.profile.name = request.body.name;
    user.email = request.body.email;
    user.password = request.body.password;
    user.profile.picture = user.gravatar();
     if(request.body.email=='mikou19000@outlook.fr'){
         user.admin=true;
     }else{
        user.admin= false;
     };       
   
            
    
 // User findOne fait une requete vers la bdd
    User.findOne({email:request.body.email},function(err,existingUser){
        
        
        if(existingUser){
            //console.log(request.body.email + 'Déja enregistré dans la bdd');
            
            request.flash('errors','Email déja présent dans base de données');
            
            return response.redirect('/signup');
            
        }else{
          // on enregistre alors dans la bdd           
            user.save(function(err){
                if(err) return next(err);
                //response.json('Nouvel utilisateur créé');
                callback(null,user);
                
              });   // fin de save
        }
      }); // fin de findOne
        },
        
        function(user,callback){
                
       var cart = new Cart();
        cart.owner = user._id;
           
            
        cart.save(function(err){
            
             if(err) return next(err);
            
               //  return response.redirect('/home');
                request.logIn(user,function(err){   
                if(err) return next(err);
                response.redirect('/profile');   
                    
        });   
          });   
        }
    ]);
    
});



//LOGOUT (déconnexion)

router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/home");
  });
});

// EDITER LA PAGE PROFILE

router.get('/edit-profile' ,function(request,response,next){
    
    response.render('account/edit-profile',{message: request.flash('succes')});
    
});


router.post('/edit-profile',function(request,response,next){
                                       
    User.findOne({ _id: request.user._id}, function(err,user){
        
        if(err) return next(err);
        
        if(request.body.name) user.profile.name = request.body.name;
        if(request.body.address) user.address = request.body.address;
        
        user.save(function(err){
            
        if(err) return next(err);
        request.flash('succes',' Vos informations ont été mise à jour avec succès');    
            
         return response.redirect('/edit-profile') ;  
            
        });
        
    });
    
});




module.exports = router;