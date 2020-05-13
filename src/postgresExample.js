//npm install sequelize
//npm install pg pg-hstore
const Sequelize = require('sequelize')
const driver = new Sequelize(
    'heroes',
    'admin',
    'admin123',
    {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }
)

async function main() {
    const Heroes = driver.define('heroes', {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        poder: {
            type: Sequelize.STRING,
            required: true
        }
    }, {
        tableName: 'TB_HEROES',
        freeeTableName: false,
        timestamps: false
    })

    await Heroes.sync()

    const result = await Heroes.findAll({
        raw: true
    })
    console.log(result)
}

main()