// inclure la librairie express

var express = require('express');


// librairie morgan

var morgan = require('morgan');


// librairie mongoose

var mongoose = require ('mongoose');

// body-parser

var bodyParser = require('body-parser');

// Moteur de template 

var ejs = require('ejs');

var engine = require ('ejs-mate');

// 3 librairies pour gérer les messages flash

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

//passerelle pour se connecter à node (node => bdd)

var passport = require('passport');



// stockage des sessions (id) et cookie

var mongoStore = require('connect-mongo')(session);

// déclaration du modèle catégorie

var Category = require('./models/category');
var Product = require('./models/product');


// Déclaration du middleware

var cartLength = require('./middlewares/middleware');

// upload image avec multer
 
//var upload = require('../middleware/multer');

// stocker l'objet express dans une variable plus courte

var app = express();

// inclure le fichier secret.js

var secret = require('./config/secret');

// connexion a la base de données 

mongoose.connect(secret.database,
                 function(err){
                
                   if(err) {console.log(err);
                   }else{
                        console.log('connexion OK');
                     }
                });
                 


// PASSERELLES (middleware)

app.use(express.static(__dirname + '/public'));
app.use(morgan("dev"));

app.engine('ejs',engine);
app.set('view engine','ejs');


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

// affichage messages flash et des gestions des cookies

app.use(cookieParser());
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:secret.secretKey,
    store: new mongoStore({
       url:secret.database,
       autoReconnect:true})
}));

app.use(flash());


// authentification

app.use(passport.initialize());
app.use(passport.session());

// Attribution par defaut de l'objet user a toutes les mainRoutes

app.use(function(request,response,next){
    response.locals.user = request.user;
    next();
});


// Pour rechercher toutes les catégories

app.use(function(request,response,next){
    
    Category.find({},function(err,categories){
        if(err) return next(err);
        
        // on stocke les categories trouvées dans le paramètre categories
        
        response.locals.categories = categories;
        next();
    });  
    
});

app.use(function(request,response,next){
    
     Product.find({},function(err,products){
        if(err) return next(err);
        
        // on stocke les categories trouvées dans le paramètre categories
        
        response.locals.products = products;
        next();
    });  
    
});



// pour utiliser notre middleware (gestion des quantités dans le panier)

app.use(cartLength);



// Définition du chemin (routes) des pages principales

var mainRoutes = require('./routes/main');
app.use(mainRoutes);

var userRoutes = require('./routes/user');
app.use(userRoutes);

var adminRoutes = require('./routes/admin');
app.use(adminRoutes);

var apiRoutes = require('./api/api');
app.use('/api',apiRoutes);


// methode listen d'express

app.listen(secret.port,function(err){
    
    if(err) throw err;
    
    console.log('Le serveur est lancé sur le port ' + secret.port);
    
});