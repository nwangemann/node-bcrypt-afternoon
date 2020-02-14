require('dotenv').config();

const express = require('express');
const massive = require('massive');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')
const { CONNECTION_STRING, SESSION_SECRET} = process.env
const PORT = 4000
const app = express();
app.use(express.json());

massive(CONNECTION_STRING)
.then(db => {
    app.set("db", db)
    console.log('connected to db')
}).catch(err => console.log(err))

app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

//auth endpoints
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(PORT, () => console.log(`Servin up some 🔥 🔥 🔥 on Port ${PORT}`))