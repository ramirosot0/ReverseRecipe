const express = require("express");
const app = express();
const spoonacular = "https://api.spoonacular.com/recipes/";
const API_KEY = "17ad2cf054384d1ca2800726be7bf110";
const unirest = require('unirest');

app.set("view engine", "ejs");

app.use(express.static("public")); //access images, css, js
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// enable use of json
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// routes
app.get("/", function(req, res) {

    res.render("index");

});

app.get("/searchByIngredient", function(req, res, next){
    // test render
    // TODO: check database for any recipes containing selected ingredients, if no results are found, search the API for recipes
    console.log(req.query);
    res.render("index");
});

app.get("/searchByDiet", function(req, res, next){
    // test render
    // TODO: return all recipes meeting the diet requirement, give the user an option to explore more recipes from the API
    console.log(req.query);
    res.render("index");
});

app.get("/searchByName", async function(req, res, next) {
    var search = spoonacular + "search?query=" + req.query.recipeName;
    let searchResults = await getRecipes(search);
    res.render("searchResults", {
        "recipeName": req.query.recipeName,
        "searchResults": searchResults.results
    });
});


app.get("/recipeSummary", async function(req, res) {
    var id = spoonacular + req.query.id + "/summary";
    let searchResults = await getRecipes(id);
    res.send(searchResults);
});

function getRecipes(url) {
    return new Promise(function(resolve, reject) {
        unirest.get(url)
            .headers({
                'Content-Type': 'application/json'
            })
            .query({
                "apiKey": API_KEY
            })
            .end(function(response) {
                resolve(response.body);
            });
    });
}

// running server
app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("Express server is running...");
});
