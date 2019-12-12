//hash password
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

module.exports = {

    logInPage: (req, res) => {
        res.render('login.ejs', {
            title: 'Register'
        });

    },

    RegisterPost: (req, res) =>{

        var username = req.body.userr;
        var password = req.body.passwordd;
        var email = req.body.email;
        var diet = req.body.diett;

        bcrypt.hash(password, saltRounds, function(err, hash) {

            let query = 'INSERT INTO users (username, password, email, diet_id) VALUES (?, ?, ?, ?)';
            con.query(query, [username, hash, email, diet], (error, result, fields)=>{
                if (error){

                    return res.render("login.ejs",{
                        taken: "taken"
                    });

                }
                res.redirect('/login');
            });

        });


    },

    logInPost: (req, res) =>{
        var username = req.body.userr;
        var password = req.body.passwordd;

        let query = 'SELECT * FROM users WHERE username = ?';
        con.query(query, [username], (err, result, fields) =>{
            if (err){
                return res.render("login.ejs",{
                    wrong: "wrong"
                });
            }
           if (result.length === 0){
               return res.render("login.ejs",{
                   wrong: "wrong"
               });//
           }
           else {
               const id = result[0].id;
               const  hash = result[0].password.toString();
               bcrypt.compare(password, hash, function(err, resp) {
                   // res == true
                   //console.log(resp);
                   if (resp === true){
                       req.session.loggedin = true;
                       req.session.username = username;
                       res.redirect('/');
                       console.log(id);
                   }
                   else {
                       res.render("login.ejs",{
                           wrong: "wrong"
                       });
                   }
               });
           }
        });
    },

    logOut: (req, res)=>{

        req.session.loggedin = false;
        req.session.destroy();
        res.redirect('/');

        console.log('logged out');

    },

    profile: (req, res)=>{
        let user = req.session.username;
        let query = 'SELECT * FROM users WHERE username = ?';
        con.query(query, [user], (err, result, fields) =>{
            if (err){
                return res.render("login.ejs",{
                    wrong: "wrong"
                });
            }
            res.render('edit.ejs', {
                userinfo: result
            });
        });
    },

    deletee: (req, res) =>{
        res.render('delete.ejs',{
            delete: "sure?"
        });
    },

    deleteepost: (req, res)=>{
        let user = req.session.username;

        let query = "DELETE FROM users WHERE username = '" + user + "'";
        con.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            req.session.loggedin = false;
            req.session.destroy();
            res.redirect('/');
        });
    },

    edit: (req, res)=>{
        let user = req.session.username;
        let password = req.body.passworddup;
        bcrypt.hash(password, saltRounds, function(err, hash) {

            let query = "UPDATE users SET `username` ='" + req.body.userrup + "', `password` = '" + hash  + "', `email` = '" + req.body.emailup + "', `diet_id` = '" + req.body.diettup + "' WHERE username = '" + user + "'";
            con.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                req.session.loggedin = false;
                req.session.destroy();
                res.redirect('/');
            });

        });



    }

};