var cheerio = require("cheerio")
var axios = require("axios")
var db = require("../models")
function apiRoutes(app) {

    app.get("/scrape", function (req, res) {
        db.Article.remove({}).then(function (result) {
            axios.get("https://www.nashvillescene.com/news").then(function (result) {
                var $ = cheerio.load(result.data)
                //  console.log($)
                var articles = []

                $("div.item").each(function (i, element) {
                    var title = $(this).children("div.element").children("div.element").find("a").find("h3").text().trim()
                    var summary = $(this).children("div.element").children("div.element").find("span.value").text().trim()
                    var link = $(this).children("div.element").children("div.element").find("a").attr("href")
                    var image = $(this).children("div.element").children("div.element").children("a").find("img.img-responsive").attr("data-bvo-src")
                    // console.log("title:", title)
                    // console.log("summary:", summary)
                    // console.log("link:", link)
                    // console.log("-------")

                    articles.push({
                        title,
                        summary,
                        link,
                        image
                    })

                    // condition to push to the array in mongodb
                    // if (title != undefined && summary != undefined && link != undefined) {
                    db.Article.create({
                        title: title,
                        summary: summary,
                        link: link,
                        image: image
                    })
                    // }
                })
                console.log(articles)
                res.send("scrape completed")
            })
        })


    })

    // app.put("/scrape", function (req, res) {
    //     for (let i = 0; i < articles.length; i++) {
    //         db.Article.create({
    //             title: title[i],
    //             summary: summary[i],
    //             link: link[i]
    //         })

    //     }
    // })

    app.get("/api/articles", function (req, res) {
        db.Article.find({ saved: true }).then(function (result) {
            res.json(result)
        })
    })

    app.put("/api/articles/:id", function (req, res) {
        db.Article.update({ _id: req.params.id }, { saved: true }).then(function (result) {
            res.json(result)
        })

    })

    app.delete("/api/articles/:id", function (req, res) {
        db.Article.update({ _id: req.params.id }, { saved: false }).then(function (result) {
            res.json(result)
        })
    })

    app.get("/", function (req, res) {
        db.Article.find({ saved: false }).then(function (result) {
            console.log(result)
            var newResults = []

            for (var i = 0; i < result.length; i++) {
                newResults.push({
                    title: result[i].title,
                    summary: result[i].summary,
                    link: result[i].link,
                    id: result[i]._id
                })
            }

            res.render("index", { articlesData: newResults })
        })
    })
    app.get("/saved", function (req, res) {
        db.Article.find({ saved: true }).then(function (result) {
            console.log(result)
            var newResults = []

            for (var i = 0; i < result.length; i++) {
                newResults.push({
                    title: result[i].title,
                    summary: result[i].summary,
                    link: result[i].link,
                    id: result[i]._id
                })
            }

            res.render("savedArticles", { articlesData: newResults })
        })
    })



}
module.exports = apiRoutes