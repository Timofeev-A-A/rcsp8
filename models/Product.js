const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
    name: String,
    description: String,
    creator: String
})

mongoose.model('products', productSchema);