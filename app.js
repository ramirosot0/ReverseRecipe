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

    //cookie: { secure: false }

}));

//mysql connection
const con = mysql.createConnection({
    host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'o46e3qfhvskvhdj9',
    password: 'pf1fzyejvyiwmwt1',
    database: 'zge4m6hnao60jhtu'
});
con.connect((err) => {
    if (err) {
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
app.use(bodyparser.urlencoded({
    extended: true
}));

// enable use of json
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(function(req, res, next) {
    res.locals.loggedin = req.session.loggedin;
    res.locals.username = req.session.username;
    next();
});



  const {logInPage, logInPost, RegisterPost, logOut, profile, edit, deletee, deleteepost} = require('./routes/loginroute');
  app.get("/login", logInPage);
  app.post("/login", logInPost);
  app.post("/register", RegisterPost);
  app.get("/logout", logOut);
  app.get('/profile', profile);

  app.post('/edit', edit);


  app.get('/delete', deletee);
  app.post('/delete',deleteepost)


// routes
app.get("/", function(req, res) {
    res.render("index");
});

app.get("/browse", async function(req, res) {
    
    let results = await getRecipesFromDatabase();
    
    // console.log(results);
    res.render("browse", {
        "results": results
    });
});

app.get("/sortRecipes", async function(req, res){
    let results = await getSortedRecipes(req.query.order);
    res.send(results);
});

app.get("/search", async function(req, res, next) {
    let ingredientOptionsString = req.query.ingredientOptions;
    if (!req.query.ingredientOptions) {
        ingredientOptionsString = "";
    }

    // TODO: check database for any recipes containing selected ingredients, if no results are found, search the API for recipes

    let searchResults = await getRecipes(req.query.recipeName, req.query.dietOptions, ingredientOptionsString.toString());
    res.render("searchResults", {
        "searchResults": searchResults.results
    });
});

app.get("/recipeSummary", async function(req, res) {
    console.log(req.query.id);
    let searchResults = await getRecipeSummary(req.query.id);
    res.send(searchResults);
});

app.get("/edit", function(req, res) {
    res.render("edit");
});

app.get("/getIngredients", async function(req, res) {
    con.query(
        `SELECT ingre_name FROM ingredients`,
        (error, results, fields) => {
            if (error) throw error;
            // console.log(results[0].ingre_name);
            res.send(results); 
        }
    ); // query
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
                resolve(response.body);
            });
    });
}

function getRecipesFromDatabase() {
    return new Promise(function(resolve, reject) {
        con.query(
            `SELECT recipe_name, likes, image FROM recipes`,
            (error, results, fields) => {
                if (error) throw error;
                // console.log(results);
                resolve (results);
            }
        ); // query
    });
}

function getSortedRecipes(order){
    return new Promise(function(resolve, reject) {
        con.query(
            `SELECT recipe_name, likes, image FROM recipes ORDER BY likes ${order}`,
            (error, results, fields) => {
                if (error) throw error;
                resolve (results);
            }
        ); // query
    });
}

// running server
app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("Express server is running...");
});
