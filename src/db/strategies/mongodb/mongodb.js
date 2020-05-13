const ICrud = require('./../interfaces/interfaceCrud')
const mongoose = require('mongoose')
const STATUS = {
    0: 'Disconectado',
    1: 'Conectando',
    2: 'Conectado',
    3: 'Disconectando',
}


class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]
        console.log(state)
        if(state === 'Conectado') return state;
        if(state !== 'Conectando') return state
            await new Promise(resolve => setTimeout(resolve, 1000))
            return STATUS[this._connection.readyState]
    }


    static async connect() {
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (error) {
            if (!error) return;
            console.log('Falha na conexão!', error)
        })
        const connection = mongoose.connection
        connection.once('open', () => console.log('database rodando!!'))
        return connection;
    }

    async create(item) {
        return this._schema.create(item)
    }

    async read(item, skip=0, limit=10) {
        return this._schema.find(item).skip(skip).limit(limit)
    }
    async update(id, item) {
        return this._schema.updateOne({_id: id}, {$set: item})
    }
    async delete(id) {
        return this._schema.deleteOne({_id: id})
    }
}

module.exports = MongoDB