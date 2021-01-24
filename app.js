const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

// Create article schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Create article model
const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////////// Requests targetting all articles ///////////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err)
            }
        });
    })
    
    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article.save((err) => {
            if (!err) {
                res.send("Successfully saved a new article");
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("Successfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

//////////////////////////////////////// Requests targetting a specific article ////////////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if (!err) {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("No article matching that title was found.");
                }
            } else {
                res.send(err);
            }
        });
    })

    .put((req, res) => {
        Article.replaceOne(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content}, 
            {overwrite: true}, 
            (err) => {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err)
            }
        });
    })

    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if (!err) {
                    res.send("Success");
                } else {
                    res.send(err)
                }
            }
        );
    })

    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle}, (err) => {
            if (!err) {
                res.send("Successfully deleted");
            } else {
                res.send(err);
            }
        });
    });

app.listen(3000, () => {console.log("Server started");});