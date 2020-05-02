var express = require("express")
var app = express()
var port = process.env.PORT || 8000
var mongoose = require("mongoose")
var expressHandlebars = require("express-handlebars")
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }))
app.set("view engine", "handlebars")


app.use(express.urlencoded({ extended: true }))
app.use(express.json())



app.use(express.static("public"))

// imported routes
var apiRoutes = require("./routes/apiRoutes")
apiRoutes(app)
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/scrape_newsdb", { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/scrape_newsdb")

app.listen(port, function () {
    console.log("app is listening http://localhost:" + port)
    console.log(process.env.PORT)
})
