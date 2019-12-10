

module.exports = {

    logInPage: (req, res) => {
        res.render('login.ejs', {
            title: 'Register'
        });

    },

    logInPost: (req, res) =>{
        var username = req.body.userr;
        var password = req.body.passwordd;

        if (username && password){
            let query = 'SELECT * FROM accounts WHERE username = ? AND password = ?';
            con.query(query, [username, password], (error, result, fields) =>{
                if (result.length > 0){
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/');
                }
                else {
                    res.send('Incorrect Username and/or Password! ');
                }
            });
        }
        else {
            console.log("wrong user or password");
        }

    },

    RegisterPost: (req, res) =>{

        var username = req.body.userr;
        var password = req.body.passwordd;

        let query = 'INSERT INTO accounts (username, password) VALUES (?, ?)';
        db.query(query, [username, password], (error, result, fields)=>{
            if (error){
                throw error;
            }
            res.redirect('/login');
        });

    },

};