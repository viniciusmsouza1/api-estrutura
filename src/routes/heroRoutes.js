const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const failAction = (request, headers, erro) => {
    throw erro;
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            config: {
                validate: {
                    tags: ['api'],
                    description: 'Deve listar Herois',
                    notes: 'Pode paginar resultados por nome',
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    },
                    headers
                }
            },
            handler: (request, headers) => {
                try {
                    const {skip, limit, nome} = request.query
                    const query = nome ? {
                        nome: {$regex: `.*${nome}*.`}
                    } : {}

                    return this.db.read(query, skip, limit)

                } catch(error) {
                    console.log('erro', error)
                    return Boom.internal()
                }
            }
        }
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Deve cadastrar Herois',
                notes: 'Criar herois por nome e poder',
                validate: {
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(100)
                    }

                }
            },
            handler: async (request) => {
                try {
                    const  {nome, poder} =request.payload
                    const result = await this.db.create({nome, poder})
                    return {
                        message: 'Heroi cadastrado com sucesso',
                        _id: result._id
                    }
                } catch(error) {
                    console.log('erro', error)
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/heroes/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve Atualizar heroi',
                notes: 'Pode atualizar qualquer campo por id',
                validate: {
                    headers,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: async (request) => {
                try{
                    const { id } = request.params
                    const { payload } = request
                    const  dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)
                    if(result.nModified !== 1) return Boom.preconditionFailed('Id não encontrado')
                    return {
                        message: 'Heroi atualizado com sucesso'
                    }

                } catch(error) {
                    console.error('err', error)
                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/heroes/{id}',
            method: 'DELETE',
            config: {
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {id} = request.params
                    const result = await this.db.delete(id)
                    if(result.n !== 1)
                    return Boom.preconditionFailed('Id não encontrado')
                    return {
                        message: 'Heroi removido com sucesso'
                    }
                } catch(error) {
                    console.error('erro', error)
                    return Boom.internal()
                }
            }
        }
    }
}
module.exports = HeroRoutes