const mongoose = require('mongoose');
mongoose.connect(process.env.DATA_BASE, { useNewUrlParser: true }).then(()=>{
    console.log('Connexion à la base de donnée')
}).catch(e=>{
    console.log(e.message)
    console.log('Erreur de connexion à la base de donnés...')
})

module.exports = mongoose;
