var router = require ('express').Router();

var Category = require('../models/category');

var Product = require('../models/product');

const multer  = require('multer')
const upload = multer({ dest: 'public/image/' });

var fs = require('fs');




// URL ajouter une catégorie(get / Post)

router.get('/admin/add-category',function(request,response,next){
    
    response.render('admin/add-category',{message: request.flash('success')});
});


router.post('/admin/add-category', function(request, response, next){

    var name = request.body.name;

    if (!name) {
        request.flash('errors', 'Le nom de la catégorie est requis');
        return response.redirect('/admin/categories');
    }

    var category = new Category();
    category.name = name;

    category.save(function(err){
        if(err) return next(err);
        request.flash('success', 'Catégorie créée avec succès !');
        return response.redirect('/admin/categories');
    });
});

// Modifier une catégorie 

router.get('/admin/edit-category/:id',function(request,response,next){
    
    Category.findById({_id: request.params.id},function(err,category){
        
        if(err) return next(err);
        
        response.render('admin/edit-category',{category:category});

        
    });
});


router.post('/admin/edit-category/:id',function(request,response,next){
    console.log(request.body)
    Category.findById({_id:request.params.id},function(err,foundCategory){
       if(err) return next(err);
          category = foundCategory;
   });
    
    category.name = request.body.name;
    
    // on sauvergarde dans la bdd
    
    category.save(function(err){
        
        if(err) return next(err);
        request.flash('success','Catégorie modifiée avec succès !');
        
        return response.redirect('/admin/categories');
    });
});


//Supprimer une catégorie

router.get('/admin/delete-category/:id',function(request,response,next){
    Category.findByIdAndRemove({_id: request.params.id}, function(err){
        if(err) return next(err);
        
        request.flash('danger', 'Catégorie supprimée avec succès !');
        
        return response.redirect('/admin/categories');
    });
});




// URL ajouter un produit 

router.get('/admin/add-product', function(request, response, next) {
  response.render('admin/add-product', {message: request.flash('success')});
});


router.post('/admin/add-product', function(request, response, next) {
    
      var product = new Product();

      product.name = request.body.name;
      product.price = request.body.price;
      product.category = request.body.category;
      product.image = 'https://picsum.photos/id/7/400';

      product.save(function(err) {
        if(err) return next(err);
        request.flash('success', 'Produit créé avec succès !');
        return response.redirect('/admin/produits');
  });
});

// Modifier un produit 


router.get('/admin/edit-product/:id',function(request,response,next){
    
   Product.findById({_id: request.params.id},function(err,product){
        
        if(err) return next(err);
        
        response.render('admin/edit-product',{product:product});

        
    });
});


router.post('/admin/edit-product/:id', upload.single('image'),function(request,response,next){
    console.log(request.file)
    Product.findById({_id:request.params.id},function(err,foundProduct){
       if(err) return next(err);
        Product = foundProduct;
      var oldpath = request.file.path;
      var newpath = request.file.originalname;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
      });  
        
         foundProduct.name = request.body.name;
         foundProduct.price = request.body.price;
         foundProduct.category = request.body.category;
         foundProduct.image = newpath;
        
    // on sauvergarde dans la bdd
    
        foundProduct.save(function(err){
        
        if(err) return next(err);
        request.flash('success','Produit modifiée avec succès !');
        
        return response.redirect('/admin/produits');
    });
});

 });



// Supprimer un produit 

router.get('/admin/delete-product/:id',function(request,response,next){
    Product.findByIdAndRemove({_id: request.params.id}, function(err){
        if(err) return next(err);
        
        request.flash('danger', 'Produit supprimée avec succès !');
        
        return response.redirect('/admin/produits');
    });
});






// URL ajouter ou modifier un utilisateur

router.get('/admin/add-users',function(request,response,next){
    
    response.render('admin/add-users',{message: request.flash('success')});
});





// Gestion des catégories par l'administrateur

router.get('/admin',function(request,response,next){
    
    response.render('admin/dashboard')
});


router.get('/admin/categories',function(request,response,next){
    
 
    
    response.render('admin/categories',{message: request.flash('success')});
});


 // Gestion des produits par l'administrateur

router.get('/admin/produits',function(request,response,next){
    
    response.render('admin/produits',{message: request.flash('success')});
});


// Gestion des utilisateurs par l'administrateur

router.get('/admin/users',function(request,response,next){
    
    response.render('admin/users')
});


// Gestion des commandes par l'admin 


module.exports = router;