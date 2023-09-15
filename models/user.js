// chargement de mongoose (connexion entre node et mongoDB)

var mongoose = require('mongoose');

// chargement de bcrypt : hashage des mdp avant meme qu'ils soient entrés dans bdd

var bcrypt = require ('bcrypt-nodejs');

var crypto = require ('crypto');

var Schema = mongoose.Schema;

// Création du modèle (la classe) pour User 

var UserSchema = new Schema({
    
    
    email:{
            type:String,
            unique:true,
            lowercase:true
        
    },
    
    admin:false,
    password:String,
    profile:{
        
             name:{ type:String,default:''},
             picture:{type:String,default:''}
        
    },
    
    address:String,
    
    history:[{
        date: Date,
        paid:{
            type:Number,
            default:0
        }
    }] 
});


// Cryptage du mot de passe (bcrypt)

UserSchema.pre('save',function(next){
    var user = this;
    
// crypter le mdp seulement s'il a été modifié ou si il est nouveau
    
  if(!user.isModified('password')) return next();
    
    bcrypt.genSalt(10,function(err,salt){
        if(err) return next(err);
        
        // crypter le mdp avec le nouveau salt
        bcrypt.hash(user.password,salt,null,function(err,hash){
            
            if(err) return next(err);
            
            user.password = hash;
            
            next();
            
        });
    });
    
});



// création fonction personnalisée avec mongoose

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}


// fonction personnalisée pour affiché un avatar

UserSchema.methods.gravatar = function(size){
    
    if(!this.size) size=200;
// si l'email ne correspond pas, alors on retourne une image aléatoire (gravatar)
    
    if(!this.email) return 'https://gravatar.com/avatar/?s' + '&d=retro';
    
// crypter afin que chaque utilisateur ait une image unique 
    
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    
 // on retourne l'image
    
    
    return 'https://www.gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
    
}



module.exports = mongoose.model('User',UserSchema);

