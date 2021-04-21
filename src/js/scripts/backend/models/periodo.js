const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const periodo = new Schema({
    cod: String,
    inicio: Date,
    fin: Date,
    sub: Number,
    estado: {
        type: String,
        default: "activo"
    }
});

module.exports = mongoose.model('periodo', periodo);