const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'o46e3qfhvskvhdj9',
    password: 'pf1fzyejvyiwmwt1',
    database: 'zge4m6hnao60jhtu'
});

connection.connect();



connection.end();


module.exports = router;