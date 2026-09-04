// Importando a biblioteca CryptoJS
const CryptoJS = require("crypto-js");
const fs = require("fs");

// Função para criptografar usando AES (ORIGINAL, sem alterações)
function encryptAES(message, key) {
  const config = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  };
  const encrypted = CryptoJS.AES.encrypt(message, key, config);
  return encrypted.toString();
}

function generateCorrectKey(keyLength) {
  return CryptoJS.lib.WordArray.random(keyLength/8).toString(CryptoJS.enc.Hex);
}

const keyLength = 256;
const correctKey = generateCorrectKey(keyLength);
const tamanhosDeMensagem = [1000, 10000, 50000, 100000, 500000, 1000000, 2000000];

console.log("=== Teste AES: tempo de criptografia x tamanho da mensagem ===");
console.log("Processando e acumulando no arquivo CSV, aguarde...");

let csvContent = "";
const filename = "aes_resultados.csv";

// Se o arquivo não existir, criamos o cabeçalho
if (!fs.existsSync(filename)) {
  csvContent += "Tamanho da mensagem;Tempo (ms)\n";
}

tamanhosDeMensagem.forEach((tamanho) => {
  const message = "a".repeat(tamanho);

  const startTime = Date.now();
  encryptAES(message, correctKey);
  const endTime = Date.now();

  const elapsedTime = endTime - startTime;
  csvContent += `${tamanho};${elapsedTime}\n`;
});

// Adicionando os novos resultados ao final do arquivo (append)
fs.appendFileSync(filename, csvContent, "utf-8");
console.log(`Concluído! Resultados da execução adicionados em '${filename}'.`);
