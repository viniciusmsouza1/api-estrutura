const mongoose = require('mongoose')
mongoose.connect('mongodb://vmsouza:admin123@localhost:27017/heroes', {
    useNewUrlParser: true, function (error) {
        if(!error) return;
        console.log('falha na conexão mongo', error)
    }
})

const connection = mongoose.connection

connection.once('open', () => console.log('mongo conectado'))

const heroesSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

const model = mongoose.model('heroes', heroesSchema)

async function main() {
    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    })
    console.log('result', resultCadastrar)
}

main()