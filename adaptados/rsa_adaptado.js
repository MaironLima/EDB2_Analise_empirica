const forge = require("node-forge");

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

// Função para descriptografar usando RSA (ORIGINAL, sem alterações)
function decryptRSA(ciphertext, privateKey) {
  const rsa = forge.pki.privateKeyFromPem(privateKey);
  const decrypted = rsa.decrypt(Buffer.from(ciphertext, "base64").toString("binary"), "RSA-OAEP");
  return decrypted;
}

// ============================================================
// ADAPTAÇÃO: o RSA só consegue cifrar blocos pequenos de cada
// vez (limitação do próprio algoritmo — ver Figura 16 do artigo,
// "Processamento de múltiplos blocos com RSA"). Por isso, para
// testar mensagens maiores, precisamos quebrar a mensagem em
// blocos e cifrar bloco por bloco usando a MESMA função
// encryptRSA original, chamada várias vezes.
// ============================================================

function encryptRSALongMessage(message, publicKey, blockSize) {
  const blocos = [];
  for (let i = 0; i < message.length; i += blockSize) {
    blocos.push(message.slice(i, i + blockSize));
  }
  // Reaproveita a função original encryptRSA para cada bloco
  return blocos.map(bloco => encryptRSA(bloco, publicKey));
}

// ============================================================
// Teste: tempo de CRIPTOGRAFAR mensagens de tamanhos crescentes,
// usando sempre o mesmo par de chaves.
// ============================================================

const keySize = 2048;

// Tamanho máximo de bytes por bloco no RSA-OAEP (SHA-1) para uma
// chave de 2048 bits: (2048/8) - 2*20 - 2 = 214 bytes.
// Usamos um valor um pouco mais conservador por segurança.
const blockSize = 190;

console.log("Gerando par de chaves RSA de", keySize, "bits...");
const { publicKey, privateKey } = generateRSAKeyPair(keySize);
console.log("Par de chaves gerado.\n");

const tamanhosDeMensagem = [1000, 10000, 50000, 100000, 500000, 1000000, 2000000];

console.log("=== Teste RSA: tempo de criptografia x tamanho da mensagem ===");
console.log("Tamanho da chave:", keySize, "bits");
console.log("Tamanho do bloco:", blockSize, "bytes\n");

const resultados = [];

tamanhosDeMensagem.forEach((tamanho) => {
  const message = "a".repeat(tamanho);

  const startTime = Date.now();
  encryptRSALongMessage(message, publicKey, blockSize);
  const endTime = Date.now();

  const elapsedTime = endTime - startTime;
  const numBlocos = Math.ceil(tamanho / blockSize);
  resultados.push({ tamanho, tempo: elapsedTime, blocos: numBlocos });

  console.log(
    `Tamanho da mensagem: ${tamanho.toString().padStart(7)} caracteres` +
    ` (${numBlocos} blocos) -> Tempo: ${elapsedTime} ms`
  );
});

console.log("\nResultados em formato de tabela (para copiar):");
console.log("Tamanho da mensagem;Número de blocos;Tempo (ms)");
resultados.forEach(r => console.log(`${r.tamanho};${r.tempo}`));