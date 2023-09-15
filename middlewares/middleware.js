var Cart = require('../models/cart');
module.exports = function(request,response, next){
    
    
    // on verifie qu'il y a bien une requete de l'utilisateur
    
    
    if(request.user){
        
      var total = 0;
      Cart.findOne({owner : request.user._id},
                  function(err,cart){
                   if(cart){
                       for(var i =0; i<cart.items.length; i++ ){
                           
                           
                           total += cart.items[i].quantity;
                       }
                     
                       response.locals.cart = total;     
                   }else{
                       
                       response.locals.cart = 0;
                   }
          
                    next();
                })   
        
        
    }else{
        
        next();
    }
    
}