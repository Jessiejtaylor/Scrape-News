var cheerio = require("cheerio")
var axios = require("axios")
var db = require("../models")
function apiRoutes(app) {

    app.get("/scrape", function (req, res) {
        axios.get("https://www.nashvillescene.com/news").then(function (result) {
            var $ = cheerio.load(result.data)
            //  console.log($)
            var articles = []

            $("div.element").each(function (i, element) {
                var title = $(element).find("a").text().trim()
                var summary = $(element).find("span").text().trim()
                var link = $(element).find("a").attr("href")
                // console.log("title:", title)
                // console.log("summary:", summary)
                // console.log("link:", link)
                // console.log("-------")

                // articles.push({
                //     title,
                //     summary,
                //     link
                // })

                // condition to push to the array in mongodb
                // if (title != undefined && summary != undefined && link != undefined) {
                // db.Article.create({
                //     title: title,
                //     summary: summary,
                //     link: link
                // })
                // }
            })
            console.log(articles)
            res.send("scrape completed")
        })

    })

    app.put("/scrape", function (req, res) {
        for (let i = 0; i < articles.length; i++) {
            db.Article.create({
                title: title[i],
                summary: summary[i],
                link: link[i]
            })

        }
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
                    summary: result[i].summary,
                    link: result[i].link
                })
            }

            res.render("index", { articlesData: newResults })
        })
    })
}
module.exports = apiRoutes