// Importando o módulo 'fs' para lidar com operações de arquivo
const fs = require("fs");

// Lendo o arquivo XML
const dadosXML = fs.readFileSync("feed_psel.xml");

// Convertendo o XML para um objeto JavaScript
const xml2js = require("xml2js");
const analisadorXML = new xml2js.Parser();
let dadosJSON;
analisadorXML.parseString(dadosXML, (erro, resultado) => {
  if (erro) {
    console.error("Erro ao analisar o XML:", erro);
    return;
  }
  dadosJSON = resultado;
});

// Removendo produtos pelos IDs
const produtosRemovidos = ["403921", "595044"];
dadosJSON.produtos.item = dadosJSON.produtos.item.filter((item) => {
  const itemId = item.id[0];
  return !produtosRemovidos.includes(itemId);
});

// Substituindo a moeda no preço dos produtos
dadosJSON.produtos.item.forEach((item) => {
  item.price[0] = item.price[0].replace("BRL", "R$");
});

// Corrigindo os links de imagem dos produtos
dadosJSON.produtos.item.forEach((item) => {
  const itemId = item.id[0];
  if (itemId === "540178") {
    item.image_link[0] = item.image_link[0].replace(
      "calca-legging-simples.jpg",
      "jaqueta-de-couro.jpg"
    );
  } else if (itemId === "106954") {
    item.image_link[0] = item.image_link[0].replace(".mp3", ".jpg");
  }
});

// Convertendo o objeto JSON modificado de volta para o XML
const construtorXML = new xml2js.Builder();
const XMLModificado = construtorXML.buildObject(dadosJSON);

// Gravando o XML modificado em um arquivo
fs.writeFile("feed_psel_modificado.xml", XMLModificado, (erro) => {
  if (erro) {
    console.error("Erro ao gravar o arquivo modificado:", erro);
    return;
  }
  console.log("Arquivo modificado e gravado com sucesso!");
});
