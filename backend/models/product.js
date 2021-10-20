const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId : { type : String },
    name : { type : String },
    manufacturer: { type : String },
    description : { type : String },
    mainPepper : { type : String },
    imageUrl: { data: Buffer, type: String  },
    heat : { type : Number },
    likes : { type : Number },
    dislikes: { type : Number },
    usersLiked : [ String ],
    usersDisliked : [ String ] 
});


module.exports = mongoose.model('Product', userSchema);