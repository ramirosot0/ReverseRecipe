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

        let query = 'SELECT password FROM users WHERE username = ?';
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

                const  hash = result[0].password.toString();
                bcrypt.compare(password, hash, function(err, resp) {
                    // res == true
                    console.log(resp);
                    if (resp === true){
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.redirect('/');
                    }
                    else {
                        res.render("login.ejs",{
                            wrong: "wrong"
                        });
                    }
                 });

        });
    },


};