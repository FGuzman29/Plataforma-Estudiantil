const express = require('express')
const router = express.Router()

const Estudiante = require('../models/estudiante.js')
const Docente = require('../models/docente.js')
const User = require('../models/users.js')
const Pensum = require('../models/pensum.js')
const Grupo = require('../models/grupo.js')

//Cargar pagina principal
router.get('/', async (req,res) => {
    const estudiantes = await Estudiante.count();
    const docentes = await Docente.count();
    const grupos = await Grupo.count();

    res.render('index', {
        estudiantes,
        docentes,
        grupos
    });
});
router.get('/perfil', async (req,res) => {
    res.render('Perfil')
})
//Cargar pagina estudiantes
router.get('/estudiantes', async (req,res) => {
    const estudiantes = await Estudiante.find();
    res.render('estudiantes',{
        estudiantes
    })
})

//Cargar pagina grupos
router.get('/grupos',  async (req,res) => {
    const grupos = await Grupo.find()
    console.log(grupos)

    res.render('grupos',{
        grupos
    })
});

//Cargar pagina docentes
router.get('/docentes', async (req,res) => {
    const docentes = await Docente.find();
    console.log(docentes)
    res.render('profesores', {
        docentes
    })
});

//Cargar pagina regEstudiante
router.get('/regEstudiante', (req,res) => {
    res.render('RegEstudiante')
});
router.get('/modPensum/:id', async (req,res) => {
    const {id} = req.params
    const pensum = await Pensum.findById(id)
    var materias = "";
    pensum.materia.forEach(element => {
        console.log(element)
        materias = materias.concat(element, " | ")
    });
    console.log(materias)
    res.render('modPensum', {pensum, materias})
});

router.post('/modPensum/:id', async (req,res) =>{
    const {id} = req.params
    await Pensum.update({_id:id}, {materia : req.body.materias.split("|")})
    res.redirect('/pensum')
})
//Cargar pagina regDocente
router.get('/RegDocente', (req,res) => {
    res.render('RegDocente')
});

router.get('/pensum', async (req,res) => {
    const pensums = await Pensum.find();

    res.render('pensum' ,{
        pensums
    })
});

//Registrar estudiante
router.post('/regEstud', async (req,res) => {
    //Crea un nuevo objeto con los datos del formulario
    const estudiante = new Estudiante(req.body);
    //Guarda el objeto en la base de datos
    await estudiante.save();
    const user = {
        cod: estudiante._id.toString(),
        user: estudiante.nombre + estudiante.apellido  ,
        password: estudiante.password,
        tipo: "estudiante"
    }
    User.collection.insertOne(user, function(err,docs) {
        if(err){ 
            console.log(err)
        } else {
            console.log('Usuario insertado')
        }
    })  
    //Vuelve a cargar la pestaña de registro
    res.render('RegEstudiante');

});

//Registrar Docente
router.post('/regDoc', async (req,res) =>{

    const docente = new Docente(req.body);
    await docente.save();
    const user = {
        cod: docente._id.toString(),
        user: docente.nombre + docente.apellido  ,
        password: docente.password,
        tipo: "docente"
    }
    User.collection.insertOne(user, function(err,docs) {
        if(err){ 
            console.log(err)
        } else {
            console.log('Usuario insertado')
        }
    })  
    res.render('RegDocente');

});


module.exports = router;
