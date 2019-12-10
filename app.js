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

app.get("/searchByIngredient", async function(req, res, next) {
    // test render
    // TODO: check database for any recipes containing selected ingredients, if no results are found, search the API for recipes
    let url = spoonacular + "findByIngredients?ingredients=" + req.query.ingredientOptions.toString();
    let searchResults = false; // results from the database
    if (!searchResults){
        searchResults = await getRecipes(url);
    }
    res.render("searchResults", {
        "query": req.query.ingredientOptions,
        "searchResults": searchResults.results
    })
});

app.get("/searchByDiet", function(req, res, next) {
    // test render
    // TODO: return all recipes meeting the diet requirement from the database, give the user an option to explore more recipes from the API
    res.render("index");
});

app.get("/searchByName", async function(req, res, next) {
    var url = spoonacular + "search?query=" + req.query.recipeName;
    let searchResults = await getRecipes(url);
    res.render("searchResults", {
        "query": req.query.recipeName,
        "searchResults": searchResults.results
    });
});


app.get("/recipeSummary", async function(req, res) {
    var url = spoonacular + req.query.id + "/summary";
    let searchResults = await getRecipes(id);
    res.send(searchResults);
});

function getRecipes(url) {
    console.log(url);
    return new Promise(function(resolve, reject) {
        unirest.get(url)
            .headers({
                'Content-Type': 'application/json'
            })
            .query({
                "apiKey": API_KEY,
            })
            .end(function(response) {
                console.log(response.body);
                resolve(response.body);
            });
    });
}

// running server
app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("Express server is running...");
});
