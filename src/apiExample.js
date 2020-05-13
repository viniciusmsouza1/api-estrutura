const Hapi = require('@hapi/hapi')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const Context = require('./db/strategies/base/contextStrategy')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema')


const app = new Hapi.Server({
    port: 4000
})

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroesSchema))

    app.route([{
            path: '/heroes',
            method: 'GET',
            handler: (request, head) => {
                return context.read()
            }
    }])
    await app.start()
    console.log('server na porta!!', app.info.port)
}
main()