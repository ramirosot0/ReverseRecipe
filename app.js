const express = require("express");
const app = express();

// you can optionally use handlebars
app.set("view engine", "ejs");

app.use(express.static("public")); //access images, css, js

// enable use of json
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// routes
app.get("/", function(req, res) {

    res.render("index");

});


// running server
app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("Express server is running...");
});