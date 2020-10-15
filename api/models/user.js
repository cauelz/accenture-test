const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    senha: {
        type: String,
        required: true
    },
    telefone: {
        numero:{
            type: String,
        },
        ddd: {
            type: String,
        }
    }
}, {
    timestamps: {createdAt: 'data_criacao', updatedAt: 'data_atualizacao'}
})

module.exports = mongoose.model('User', userSchema);