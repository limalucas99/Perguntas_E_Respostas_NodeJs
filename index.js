//EJS - motor de template
const express = require("express");
//Necessário para aceitar arquivos estáticos(css,imagens, etc)

const app = express();

const bodyParser = require("body-parser");

const connection = require("./database/database");

const Pergunta = require("./database/pergunta");
//Database

const Resposta = require("./database/Resposta");

connection.authenticate().then(()=>{
    console.log("conexão feita com o banco de dados!");
}).catch((msgerro)=>{
    console.log(msgerro);
});

//SETANDO O MOTOR DE ENGINE ESCOLHIDO
app.set('view engine','ejs');

//Pasta public - padrão de desenvolvimento
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//PEGA OS ARQUIVOS DA PASTA views - NÃO É NECESSÁRIO POR A EXTENSÃO
//O MÉTODO RENDER OLHA DENTRO DA PASTA views
//PARA PEGAR DE OUTRO PASTA, É NECESSÁRIO COLOCAR pasta/arquivo
//PORÉM, A PASTA DEVE ESTAR DENTRO DA PASTA views
//SÓ RECONHECE OS ARQUIVOS html DENTRO DA PASTA views
app.get("/",(req,res)=>{
     //select * from perguntas
    Pergunta.findAll({raw: true, order:[
        ['id','DESC'] //ASC = crescente || DESC  = decrescente
    ]}).then(perguntas=>{
       //raw:true - pega somente o conteúdo das tabelas
       res.render("index",{
            perguntas: perguntas
       })
    });
   
});

app.get("/perguntar",(req,res)=>{
    res.render("perguntar");
});

app.post("/salvarpergunta",(req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    });
})

app.get("/pergunta/:id",(req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where:{id: id}
    }).then(pergunta =>{
        if(pergunta){//pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[['id','DESC']]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }
        else{
            res.redirect("/");//não encontrado
        }
    });
})

app.post("/responder",(req,res)=>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId);
    });
});

app.listen(9000,()=>{
    console.log("App Rodando");
})