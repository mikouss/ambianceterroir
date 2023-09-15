$(function(){
    
    // payment (validation du paiement)
    
 Stripe.setPublishableKey('pk_test_51MRGRsI8AfndGIUs9dLrQ5DgLTsSBotO1QyEpOP8ejvwqPGu88wOFNC9qprim9YWk2Bnm3C435V7Wzd5nVpr05wN00PS8QopzV');   
    
$('#payment-form').submit(function(e){
   e.preventDefault();  
     
$('#submit-button').attr('disabled','disabled');
    
   Stripe.createToken({
       name:$('#card-name').val(),
       number:$('#card-number').val(),
       cvc:$('#card-cvc').val(),
       exp_month:$('#exp_month').val(),
       exp_year:$('#exp_year').val()
   },stripeResponseHandler);  
 });
    
    
 function stripeResponseHandler(status,response){
     
     if(response.error){
         
         $('#payment-error').html('<div class="alert alert-danger">' + response.error.message +'</div>');
         $('#submit-button').removeAttr('disabled');
         
     }else{
         
         var token = response['id'];
         var form = $('#payment-form');
         form.append('<input type="hidden" name="stripeToken" value="' + token + '">');
         
         form.get(0).submit();
   }
 }   
    

// Incrémentation + (#plus)

$(document).on('click','#plus',function(e){
    e.preventDefault();
    
    
 // On récupere les valeurs des champs priceValue et quantity
    
    var priceValue = parseFloat($('#priceValue').html());
    
    var quantity = parseInt($('#quantity').val());
    
    priceValue  += parseFloat($('#priceHidden').val());
    console.log(priceValue,priceValue.toFixed(2))
 // Quand on click sur + on ajoute 1 
    
    quantity += 1;
    
    
 // On attribut les nouvelles valeurs(quantity,prix,total)
    
    $('#quantity').val(quantity);
    $('#priceValue').html(priceValue.toFixed(2));
    $('#total').html(quantity);
    $('#productprice').val(priceValue.toFixed(2));
});



//Incrémentation - (#minus)


$(document).on('click','#minus',function(e){
    e.preventDefault();
    
    
 // On récupere les valeurs des champs priceValue et quantity
    
    var priceValue = parseFloat($('#priceValue').html());
    
    var quantity = parseInt($('#quantity').val());
    
    if(quantity ==1){
        
       priceValue = $('#priceHidden');
        
       quantity = 1;
        
    }else{
        
    priceValue  -= parseFloat($('#priceHidden').val());
    
 // Quand on click sur + on ajoute 1 
    
    quantity -= 1;
    
    }
    
 // On attribut les nouvelles valeurs(quantity,prix,total)
    
    $('#quantity').val(quantity);
    $('#priceValue').html(priceValue.toFixed(2));
    $('#total').html(quantity);
    $('#productprice').val(priceValue.toFixed(2));
        
    
});
});



