const express = require("express");
const app = express();
// const spoonacular = "https://api.spoonacular.com/recipes/complexSearch";
const API_KEY = "17ad2cf054384d1ca2800726be7bf110";
const unirest = require('unirest');
const bodyparser = require('body-parser');
const mysql = require('mysql');

//express-session
const session = require('express-session');
//Enable sessions
app.use(session({
    secret: 'secret',
    path: '/',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//mysql connection
const con = mysql.createConnection({
   host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
   user: 'o46e3qfhvskvhdj9',
   password:'pf1fzyejvyiwmwt1',
   database:'zge4m6hnao60jhtu'
});
con.connect((err)=>{
    if (err){
        console.log('failed to connect to database');
    }
    console.log('Connected to database');
});
global.con = con;

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

app.use(express.static("public")); //access images, css, js
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true}));

// enable use of json
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


//loginroutes
  const {logInPage, logInPost, RegisterPost} = require('./routes/loginroute');
  app.get("/login", logInPage);
  app.post("/login", logInPost);
  app.post("/register", RegisterPost);

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
