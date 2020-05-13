const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const failAction = (request, headers, erro) => {
    throw erro;
}

const Jwt = require('jsonwebtoken')
const passwordHelper = require('./../helpers/passwordHelper')

const USER = {
    username: 'xuxa',
    password: '123'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }


    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'faz login com user e senha',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload

                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                })
                if(!usuario) {
                    return Boom.unauthorized('Usuario não existe')
                }
                const match = await passwordHelper.comparePassword(password, usuario.password)
                if(!match) {
                    return Booom.unauthorized('Usuario ou senha inválidos')
                }

                // if (username.toLowerCase() !== USER.username || password !== USER.password)
                //     return Boom.unauthorized()

                const token = Jwt.sign({
                    username: username,
                    id: usuario.id
                }, this.secret)
                
                return {
                    token
                }
            }
        }
    }
}

module.exports = AuthRoutes