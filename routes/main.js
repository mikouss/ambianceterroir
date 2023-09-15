var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');

var Cart = require ('../models/cart');

var stripe = require ('stripe')('sk_test_51MRGRsI8AfndGIUs5JLYTqovL7t4bVoFTCeT8rrz4RmjM0VBVAOX6EIqB5UDk7ljJgPuTF35k9xUBmyGlFyNghyN007w9jckSx');
var passport = require('passport');
var passportConf = require('../config/passport');



// creation url de la page d'accueil 

router.get('/home',function(request,response){
    
    response.render('main/home');
    
});


// url du menu (restaurant)

router.get('/menu',function(request,response){
    
    response.render('main/menu');
    
});

// url de reservation

router.get('/reserved',function(request,response){
    
    response.render('main/reserved');
    
});

// url pour afficher les produits d'une catégorie

router.get('/products/:id',function(request,response, next){
    
    Product.find({category : request.params.id})
           .populate('category')
           .exec(function(err,products){
              if(err) return next(err);
               response.render('main/category',{products:products});
    });
  
});



// url pour afficher un produit


router.get('/product/:id',function(request,response, next){
    
    Product.findById({_id: request.params.id},function(err,product){
        
        if(err) return next(err);
        
        response.render('main/product',{product:product});
        
    });
    
});


router.post('/product/:product_id',function(request,response, next){
    
   // on cherche le propriétaire du panier
    
 Cart.findOne({owner: request.user._id}, function(err,cart){
     
  // On ajoute le produit au panier  (nom, prix, quantité)
     
      cart.items.push({
      item:request.body.product_id,
      price: parseFloat(request.body.priceValue),
      quantity: parseInt(request.body.quantity)
  });  
     
     // total du panier est incrémenté du prix des produits ajoutés
     
     cart.total = (cart.total + parseFloat(request.body.priceValue)).toFixed(2);
     
     // sauvegarde du panier dans la bdd
     cart.save(function(err){
         
         if(err) return next(err);
         
         // si c'est ok, on redirige l'utilisateur vers la page " cart "
         
         return response.redirect('/cart');  
     });
     
  }); 
    
});


// URL pour afficher la page Panier

router.get('/cart', function(request,response,next){
    
    Cart.findOne({owner:request.user._id})
        .populate('items.item')
        .exec(function(err,foundCart){
          if(err) return next(err);
        console.log(foundCart);
           response.render('main/cart',{foundCart:foundCart,message : request.flash('remove')});
        
   });
    
});


// Route pour supprimer un article du panier

router.post('/remove',function(request, response,next){
    
// Identifier le propriétaire du panier
    
 Cart.findOne({owner:request.user._id},function(err,foundCart){
        
 
// On supprime de la liste le produit
        
  foundCart.items.pull(String(request.body.item));      
        
  
// On décrémente la somme globale
     
  foundCart.total = (foundCart.total - parseFloat (request.body.price)).toFixed(2); 
     
// sauvegarde dans la Bdd
     
   foundCart.save(function(err,found){
       if(err) return next(err);
    // On affiche un message 
       
      request.flash('remove','Produit supprimé'); 
       
    // On redirige vers le panier   
       
       response.redirect('/cart');
   });
        
 });
   
});


router.get('/paymentOk' ,function(request,response){
    response.render('main/paymentOk');  
});


router.post('/payment',function(request,response){
    
   var stripeToken = request.body.stripeToken;
   var charge = {
       amount:request.body.stripeMoney* 100,
       currency: 'EUR',
       card:stripeToken
    };
    
    
 stripe.charges.create(charge,function(err,resp){
     if(err){console.log(err)
            
     }else{
           
     if(resp.paid){
          
       var data = {'success':'Paiement accepté'};
       response.render('main/paymentOk',data);
      } 
         
   }
     
 });
    
});



// afficher l'historique des paiements

/*router.get('/profile', (req, res) => {
    
    const user = passport.authenticate(req);
    if (!user) {
        res.redirect('/login');
        return;
    }
    stripe.charges.list({ customer: user.stripeCustomerId, limit: 100 }, (err, charges) => {
        if (err) {
            res.send(err);
        } else {
            res.render('profile', { user: user, charges: charges.data });
        }
    });
});*/




module.exports = router;