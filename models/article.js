var mongoose = require("mongoose")
var Schema = mongoose.Schema
var articleSchema = new Schema({
    title: { type: String },
    summary: { type: String },
    link: { type: String },
    image: { type: String },
    saved: { type: Boolean, default: false }

})

var Article = mongoose.model("Article", articleSchema)

module.exports = Article