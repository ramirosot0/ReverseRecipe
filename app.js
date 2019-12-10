const express = require("express");
const app = express();
// const spoonacular = "https://api.spoonacular.com/recipes/complexSearch";
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

app.get("/search", async function(req, res, next) {
    // check to see if the user searched by ingredients, 
    // if not then we send an empty string to the API
    // since we can't read the toString of undefined
    let ingredientOptionsString = req.query.ingredientOptions;
    if (!req.query.ingredientOptions) {
        ingredientOptionsString = "";
    }

    // TODO: check database for any recipes containing selected ingredients, if no results are found, search the API for recipes
    let searchResults = false; // results from the database
    if (!searchResults) {
        searchResults = await getRecipes(req.query.recipeName, req.query.dietOptions, ingredientOptionsString);
    }
    res.render("searchResults", {
        "searchResults": searchResults.results
    });
});

app.get("/recipeSummary", async function(req, res) {
    console.log(req.query.id);
    let searchResults = await getRecipeSummary(req.query.id);
    res.send(searchResults);
});

function getRecipes(query, diet, includeIngredients) {

    return new Promise(function(resolve, reject) {
        unirest.get("https://api.spoonacular.com/recipes/complexSearch")
            .headers({
                'Content-Type': 'application/json'
            })
            .query({
                "apiKey": API_KEY,
                "query": query,
                "diet": diet,
                "includeIngredients": includeIngredients,
                "addRecipeInformation": true,
                "instructionsRequired": true
            })
            .end(function(response) {
                // console.log(response.body.results);
                resolve(response.body);
            });
    });
}

function getRecipeSummary(id) {
    return new Promise(function(resolve, reject) {
        unirest.get("https://api.spoonacular.com/recipes/" + id + "/summary")
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
