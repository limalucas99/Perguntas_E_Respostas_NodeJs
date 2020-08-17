const Sequelize = require('sequelize');

const connection = require('./database');

//nome da tabela - pergunta - nome dos campos - titulo, descricao
const Pergunta = connection.define('pergunta',{
    titulo:{
        type: Sequelize.STRING,
        allowNulll: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNulll: false
    }
});

Pergunta.sync({force:false}).then(()=>{
});

module.exports = Pergunta;