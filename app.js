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

app.get("/articles", (req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err)
        }
    });
});

app.post("/articles", (req, res) => {
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
});

app.listen(3000, () => {console.log("Server started");});