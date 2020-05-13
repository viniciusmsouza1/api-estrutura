const assert = require('assert')
const api = require('./../api')
let app = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin',
    poder: 'Marreta'
}

const MOCK_HEROI_INICIAL = {
    nome: 'gavião negro',
    poder: 'flechas'
}

describe.only('Suite testes api heroes', function () {
    this.beforeAll(async () =>{
        app = await api
        const result = await app.inject({
            method: 'POST',
            url:'/heroes',
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })

    it('listar /heroes', async() => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes'
        })

        const  dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        console.log(result.statusCode)
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))

    })
    it.only('listar /heroes retorna 10 registros', async () =>{
        const result = await app.inject({
            method: 'GET',
            url: '/heroes?skip=0&limit=10'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === 10)
    } )

    it('cadastrar heroes /heroes', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            payload: MOCK_HEROI_CADASTRAR
        })

        const statusCode = result.statusCode
        const { message} = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(message, "Heroi cadastrado com sucesso")
    })

    it('atualizar PATCH /heroes/:id', async () => {
        const _id = MOCK_ID
        const expected = {
            poder:'flecha'
        }
       
        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: JSON.stringify(expected)
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, "Heroi atualizado com sucesso")
    })

    it('remover heroi', async () => {
        const _id = MOCK_ID
        const result = await app.inject({
            method:'DELETE',
            url: `/heroes/${_id}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, "Heroi removido com sucesso")
    })
})