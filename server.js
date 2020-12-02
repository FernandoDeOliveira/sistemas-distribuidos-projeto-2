// JavaScript source code
//import bodyParser from 'body-parser';

const express = require('express');
const app = express();
var bodyParser = require('body-parser')

const porta = process.env.PORT || 8080;
cont = 4; // Abstraindo o imóvel que será inserido

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const bd = [
    {
        nome: "IMOVEL_0",
        cidade: "CIDADE_0",
        classe: "CLASSE_1",
        diponivel: "DISPONIVEL",
    },
    {
        nome: "IMOVEL_1",
        cidade: "CIDADE_1",
        classe: "CLASSE_1",
        diponivel: "INDISPONIVEL",
    },
    {
        nome: "IMOVEL_2",
        cidade: "CIDADE_2",
        classe: "CLASSE_2",
        diponivel: "DISPONIVEL",
    },
    {
        nome: "IMOVEL_3",
        cidade: "CIDADE_3",
        classe: "CLASSE_3",
        diponivel: "DISPONIVEL",
    }
];

// Verbos HTTP
/*  GET: Receber dados de um Resource - app.get("/clients") ou app.get("/clients/:id", (req, res) =>{ ... })
    POST: Enviar dados ou informações para serem processados por um Resource - app.post(/clients)
    PUT: Atualizar dados de um Resource - app.put(/clients)
    DELETE: Deletar um Resource - app.delete(/clients)
    Na própria máquina: http://localhost:porta*/

app.get("/", (req, res) => {
    //Abstração da pagina inicial
    res.send("Pagina Principal /cadastrar /listar /reservar /datas");
})

app.get("/listar", (req, res) => {
    //Aparece todos os imóveis cadastrados no BD;
    res.send(JSON.stringify(bd));
})

app.get("/datas", (req, res) => {
    //Aparece todos os imóveis cadastrados no BD que estão disponiveis;
    resultado = [];
    verificarInfo = false;
    for (i = 0; i < bd.length; i++) {
        // Verifica apenas os imoveis com o status disponivel
        if (bd[i]["diponivel"] == "DISPONIVEL") {
            resultado.push(bd[i]);
            verificarInfo = true;
        }
    }
    if (verificarInfo) {
        res.send(JSON.stringify(resultado));
    } else {
        res.send("Nao ha imovel disponivel");
    }
    
})

app.post("/cadastrar", (req, res) => {
    /* Informações necessárias
    {
    "nome": "qualquer coisa",
    "cidade": "qualquer coisa",
    "classe": "qualquer coisa",
    }*/
    verificarInfo = true;
    var { nome, cidade, classe } = req.body;
    for (var key in { nome, cidade, classe}) {
        if ({ nome, cidade, classe}[key] == undefined) {
            verificarInfo = false;
            cont -= 1;
            break;
        }
        // Essas 3 partes comparando as KEY são abstracoes que representam os dados
        // inseridos pelo cliente.
        if (key == "nome") {
            nome = "IMOVEL_" + cont.toString();
            cont += 1;
        } else if (key == "cidade") {
            indiceCidade = Math.floor((Math.random() * 3) + 1);
            cidade = "CIDADE_" + indiceCidade.toString();
        } else if (key == "classe") {
            indiceClasse = Math.floor((Math.random() * 3) + 1);
            classe = "CLASSE_" + indiceClasse.toString();
        }
    }

    if (verificarInfo) {
        diponivel = "DISPONIVEL";
        bd.push({ nome, cidade, classe, diponivel });
    }
    res.send(JSON.stringify({ nome, cidade, classe, diponivel }));
    
});

app.post("/reservar", (req, res) => {
    /*Informações necessárias
    {
    "cidade": 0 a 3,
    "classe": 1 a 3,
    }*/
    dictCidade = { 0: "CIDADE_0", 1: "CIDADE_1", 2: "CIDADE_2", 3: "CIDADE_3"};
    dictClasse = { 1: "CLASSE_1", 2: "CLASSE_2", 3: "CLASSE_3"};
    var { cidade, classe } = req.body;
    if (cidade < 0 && cidade > 3 || classe < 1 && classe > 3) {
        res.send("Insira valores validos");
    } else {
        verificarInfo = false;
        for (i = 0; i < bd.length; i++) {
            // Aqui é verificado se as informacoes batem com a requisicao do cliente
            if (bd[i]["diponivel"] == "DISPONIVEL") {
                if (bd[i]["cidade"] == dictCidade[cidade]) {
                    if (bd[i]["classe"] == dictClasse[classe]) {
                        bd[i]["diponivel"] = "INDISPONIVEL";
                        verificarInfo = true;
                        break;
                    }
                }
            }
        }
        if (verificarInfo) {
            res.send("A requisicao \"reservar\" esta ok");
        } else {
            res.send("Nao foi possivel realizar a reserva");
        }
        
    }
});

app.listen(porta, () => {
    console.log('Servidor executando!');
});