var cheerio = require("cheerio")
var axios = require("axios")
var db = require("../models")

var Comment = require("../models/Comment.js");
var Article = require("../models/article.js");

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
    // jessies notes trial code from video

    app.post("/comment/:id", function (req, res) {

        var content = req.body.comment;
        var articleId = req.params.id;

        var commentObj = {

            body: content
        };

        var newComment = new Comment(commentObj);

        newComment.save(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log(doc._id);
                console.log(articleId);

                Article.findOneAndUpdate(
                    { _id: req.params.id },
                    { $push: { comment: doc._id } },
                    { new: true }

                ).exec(function (err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/savedArticle/" + articleId);
                    }
                });
            }
        });
    });
    // end jessies notes from video

    // // jessies trial code from github
    //     app.get("/api/notes/:id", (req, res) => {
    //         const id = req.params.id;
    //         db.Article.findById(id)
    //             .populate("notes")
    //             .then(results => {
    //                 let renderObj = { id: id, notes: results.notes, layout: false };
    //                 res.render("notes", renderObj);
    //             })
    //             .catch(error => res.json(error));
    //     });

    //     app.post("/api/notes/add/:id", (req, res) => {
    //         const id = req.params.id;
    //         const options = {
    //             new: true,
    //             runValidators: true
    //         };

    //         db.Article.create(req.body)
    //             .then(results =>
    //                 db.Article.findByIdAndUpdate(id, { $push: { notes: results._id } }, options))
    //             .then(results => res.json(results))
    //             .catch(error => res.json(error));
    //     });

    //     app.put("/api/update", (req, res) => {
    //         const id = req.body.id;
    //         const update = { saved: req.body.saved };
    //         const options = {
    //             new: true,
    //             runValidators: true
    //         };

    //         db.Article.findByIdAndUpdate(id, update, options)
    //             .then((error, result) => {
    //                 let response = { id: id };

    //                 error ? response.error = `Error occurred`
    //                     : response.message = `Headline save status updated`;

    //                 res.json(response);
    //             })
    //     });

    //     app.delete("/api/delete", (req, res) => {
    //         const id = req.body.id;

    //         db.Article.findByIdAndRemove(id)
    //             .then((error, result) => {
    //                 let response = { id: id };

    //                 error ? response.error = `Error occurred`
    //                     : response.message = `Headline deleted`;

    //                 res.json(response);
    //             });
    //     });

    //     app.delete("/api/notes/delete", (req, res) => {
    //         const id = req.body.id;

    //         db.Article.findByIdAndRemove(id)
    //             .then((error, result) => {
    //                 let response = { id: id };

    //                 error ? response.error = `Error occurred`
    //                     : response.message = `Note deleted`;

    //                 res.json(response);
    //             });
    //     });


}
module.exports = apiRoutes