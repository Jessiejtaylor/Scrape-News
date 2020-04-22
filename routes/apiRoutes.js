var cheerio = require("cheerio")
var axios = require("axios")

function apiRoutes(app) {

    app.get("/scrape", function (req, res) {
        axios.get("http://nashvilleguru.com/").then(function (response) {
            var $ = cheerio.load(response.data)
            console.log($)
            $("div.hundred").each(function (i, element) {
                var section = $(this).children("h1").find("a").text()

                console.log(section)
            })

            $("div.article-container").each(function (i, element) {
                var title = $(this).children("h2").find("a").text()

                console.log(title)
            })

            $("div.article-container").each(function (i, element) {
                var link = $(this).children("h2").find("a").attr("href")

                console.log(link)
            })
            res.send("scrape complete")
        })
    })
}
module.exports = apiRoutes