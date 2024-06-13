const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    email: {type: String, require: true, unique: true},
    username : {type: String, require: true, min: 4, unique: true},
    password: {type: String, min: 4, required: true},
    name: String,
    profilePicture: String,
    age: Number,
    bio: String,
    experience: String,
    favoriteBooks: String,
    favoriteAuthors: String,
    goals: String,
    preferredGenre: String,
    socialMediaLinks: {
        facebook: String,
        instagram: String,
        tiktok: String,
        pinterest: String,
        twitter: String,
    }
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;