require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT;
const verify = require('./middlewares/verifyToken');
const cors = require('cors')

app.use(cors())

mongoose.connect(process.env.MONGOURL, {useNewUrlParser: true}, (err) => {
    if(!err){
        console.log('Mongo conectado correctamente');
    }
});


const {login, register} = require('./controllers/auth');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('<h1>Hola Mundo</h1>');
});

// Llenamos el schema
app.post('/new/user',verify.verifyTkn, register);

app.post('/login', login);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
})