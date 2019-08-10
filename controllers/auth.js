const bcrypt = require('bcrypt');
const saltRounds = 10;
const { user } = require('../models/user'); // se debe de llamar igual al objeto const user = mongoose.model('Users', User); del modelo
//const NombreVariable = require('./models/user').user; // Otra forma de hacer lo de la línea anterior
const jwt = require('../services/jwt');

exports.login = (req, res)=>{
    let params = req.body;

    if(params.email && params.password){
        user.findOne({ email: params.email}, (err, response)=> { // si no se ejecuta se puede agregar exec
            if(err){
                res.status(500).json({message:'Ocurrió un error'});
            }else if(response !== null){
                bcrypt.compare(params.password, response.password, function(err, resp) {
                    if(err){
                        res.status(500).json({message:'Ocurrió un error', err});
                    }

                    if(resp){
                        response.password = ':(';
                        res.status(201).json({status:'OK', data: response, token: jwt.createToken(response)});
                    }else{
                        res.status(400).json({message: 'No se logueó el usuario'});
                    }
                });
            }else{
                res.status(200).json({message: `El correo ${params.email} no existe`});
            }
        });
    }else{
        res.status(400).json({message: 'Sin datos'});
    }
};


exports.register = (req, res) => {
    let params = req.body;

    if(params.email && params.password && params.name){

        user.findOne({ email: params.email}, (err, response)=> {
            if(err){
                res.status(500).json({message:'Ocurrió un error'});
            }else if(response !== null){
                res.status(200).json({message: `El correo ${params.email} ya existe`});
            }else{

                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(params.password, salt, function(err, hash) {
                        let newUser = user({
                            name: params.name,
                            email: params.email,
                            password: hash
                        });

                        newUser.save((err, result)=> {
                            if (err) {
                                res.status(500).json({message: 'Ocurrió un error', err});
                            } 
                            
                            if(result){
                                newUser.password = ':(';
                                res.status(201).json({status:'OK', data: result});
                            }else{
                                res.status(400).json({message: 'No se creó el usuario'});
                            }
                        });                        
                    });
                });
            }
        });
    }else{
        res.status(400).json({message: 'Sin datos'});
    }
};