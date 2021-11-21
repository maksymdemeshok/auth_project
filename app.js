require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));




mongoose.connect(`mongodb://localhost:27017/userDB`);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});





const User = new mongoose.model('User', userSchema);



app.get('/', (req, res) => {

    res.render('home')
})

app.get('/login', (req, res) => {

    res.render('login')
})
app.get('/register', (req, res) => {

    res.render('register')
})


app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        let newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(err => {
            if (!err) {
                res.render('secrets');
            } else {
                console.log(err);
            }
        });

    })



})


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne(
        { email: username },
        (err, foundUser) => {
            if (!err) {
                if (foundUser) {
                    bcrypt.compare(password, foundUser.password, (err,bcryptResult)=>{
                        if(bcryptResult === true) {
                            res.render('secrets')
                        }
                    })
                } else {
                    console.log(`There is no such user`);
                }
            } else {
                console.log(err);
            }
        }
    )

});




const port = 3000;
app.listen(port, () => {
    console.log('Server is running on port ' + port);
})