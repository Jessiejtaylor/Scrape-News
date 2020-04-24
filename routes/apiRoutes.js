var cheerio = require("cheerio")
var axios = require("axios")
var db = require("../models")
function apiRoutes(app) {

    app.get("/scrape", function (req, res) {
        axios.get("http://nashvilleguru.com/best-nashville-happy-hours-and-specials").then(function (result) {
            var $ = cheerio.load(result.data)
            //  console.log($)
            var articles = {}

            $("div.sub-section").each(function (i, element) {
                var section = $(this).children("h3").text()
                var title = $(this).find("div.basic-container").find("a").text()
                var link = $(this).find("div.basic-container").find("a").attr("href")
                console.log("section:", section)
                console.log("title:", title)
                console.log("link:", link)
                console.log("-------")

                // condition to push to the array in mongodb
                if (section != undefined && title != undefined && link != undefined) {
                    db.Article.create({
                        section: section,
                        title: title,
                        link: link
                    })
                }
            })

            // $("div.article-container").each(function (i, element) {
            //     var title = $(this).children("h2").find("a").text()

            //     console.log(title)
            // })

            // $("div.article-container").each(function (i, element) {
            //     var link = $(this).children("h2").find("a").attr("href")

            //     console.log(link)
            // })
            res.send("scrape complete")
        })

    })

    app.get("/api/articles", function (req, res) {
        db.Article.find().then(function (result) {
            res.json(result)
        })
    })

    app.put("/api/articles/:id", function (req, res) {
        db.Article.update({ _id: req.params.id }, { saved: true }).then(function (result) {
            res.json(result)
        })
    })

    app.get("/", function (req, res) {
        db.Article.find({}).then(function (result) {
            console.log(result)
            var newResults = []

            for (var i = 0; i < result.length; i++) {
                newResults.push({
                    title: result[i].title,
                    section: result[i].section,
                    link: result[i].link
                })
            }

            res.render("index", { articlesData: newResults })
        })
    })
}
module.exports = apiRoutes