const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "env inválida, ou dev ou prod")

const configPath = join(__dirname, './../config', `.env.${env}`)
config({
    path: configPath
})

const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroSchema = require('./db/strategies/mongodb/schemas/heroesSchema')
const HeroRoutes = require('./routes/heroRoutes')
const AuthRoutes = require('./routes/authRoutes')
const HapiJwt = require('hapi-auth-jwt2') 

const Postgres = require('./db/strategies/postgres/postgres')
const UserSchema= require('./db/strategies/postgres/schemas/userSchema')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const JWT_SECRET = process.env.JWT_KEY

const app = new Hapi.Server({
    port: process.env.PORT
})
function mapRoutes (instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroSchema))

    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UserSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, model))

    const swaggerOptions = {
        info: {
            title: 'API Heroes  - #CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        validate: async (dados, request) => {
            //verifica se user ativo
            const result = await contextPostgres.read({
                username: dados.username.toLowerCase(),
                id: dados.id
            })
            if(!result) {
                return {
                    isValid: false
                }
            }
            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')


    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())
    ]
    )

    await app.start()
    console.log('server running at', app.info.port)

    return app;
}
module.exports = main()