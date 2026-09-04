const forge = require("node-forge");
const fs = require("fs");

// Função para gerar chaves RSA (ORIGINAL, sem alterações)
function generateRSAKeyPair(keySize) {
  const rsa = forge.pki.rsa;
  const keyPair = rsa.generateKeyPair({ bits: keySize });
  return {
    publicKey: forge.pki.publicKeyToPem(keyPair.publicKey),
    privateKey: forge.pki.privateKeyToPem(keyPair.privateKey)
  };
}

// Função para criptografar usando RSA (ORIGINAL, sem alterações)
function encryptRSA(message, publicKey) {
  const rsa = forge.pki.publicKeyFromPem(publicKey);
  const encrypted = rsa.encrypt(message, "RSA-OAEP");
  return Buffer.from(encrypted, "binary").toString("base64");
}

function encryptRSALongMessage(message, publicKey, blockSize) {
  const blocos = [];
  for (let i = 0; i < message.length; i += blockSize) {
    blocos.push(message.slice(i, i + blockSize));
  }
  return blocos.map(bloco => encryptRSA(bloco, publicKey));
}

const keySize = 2048;
const blockSize = 190;

console.log("Gerando par de chaves RSA de", keySize, "bits...");
const { publicKey, privateKey } = generateRSAKeyPair(keySize);
console.log("Par de chaves gerado.\n");

const tamanhosDeMensagem = [1000, 10000, 50000, 100000, 500000, 1000000, 2000000];

console.log("=== Teste RSA: tempo de criptografia x tamanho da mensagem ===");
console.log("Processando e acumulando no arquivo CSV, aguarde...");

let csvContent = "";
const filename = "rsa_resultados.csv";

// Se o arquivo não existir, criamos o cabeçalho
if (!fs.existsSync(filename)) {
  csvContent += "Tamanho da mensagem;Tempo (ms)\n";
}

tamanhosDeMensagem.forEach((tamanho) => {
  const message = "a".repeat(tamanho);

  const startTime = Date.now();
  encryptRSALongMessage(message, publicKey, blockSize);
  const endTime = Date.now();

  const elapsedTime = endTime - startTime;
  csvContent += `${tamanho};${elapsedTime}\n`;
});

// Adicionando os novos resultados ao final do arquivo (append)
fs.appendFileSync(filename, csvContent, "utf-8");
console.log(`Concluído! Resultados da execução adicionados em '${filename}'.`);
