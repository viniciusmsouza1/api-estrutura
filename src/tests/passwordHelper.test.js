const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'admin123'
const HASH = '$2b$04$40MpD3gOnhznwH/nzkX6ruvc1VMppkpGZIX6FG.Z7MGNcToXJcbw.'


describe('UserHelper test suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        console.log(result)
        assert.ok(result.length > 10)
    })

    it('deve comparar uma senha e seu hash', async () =>{
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        console.log(result)
        assert.ok(result)
    })
})