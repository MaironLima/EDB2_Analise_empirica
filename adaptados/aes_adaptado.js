// Importando a biblioteca CryptoJS
const CryptoJS = require("crypto-js");

// Função para criptografar usando AES (ORIGINAL, sem alterações)
function encryptAES(message, key) {
  const config = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  };
  const encrypted = CryptoJS.AES.encrypt(message, key, config);
  return encrypted.toString();
}

// Função para descriptografar usando AES (ORIGINAL, sem alterações)
function decryptAES(ciphertext, keys) {
  const config = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  };
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, config);
    try {
      const decryptedMessage = decrypted.toString(CryptoJS.enc.Utf8);
      return decryptedMessage;
    } catch (error) {
      continue;
    }
  }
  throw new Error("Nenhuma chave válida encontrada.");
}

// Função para gerar chaves aleatórias (ORIGINAL, sem alterações)
function generateRandomKeys(numKeys, keyLength) {
  const keys = [];
  for (let i = 0; i < numKeys; i++) {
    const key = CryptoJS.lib.WordArray.random(keyLength/8).toString(CryptoJS.enc.Hex);
    keys.push(key);
  }
  return keys;
}

// Função para gerar uma chave correta (ORIGINAL, sem alterações)
function generateCorrectKey(keyLength) {
  return CryptoJS.lib.WordArray.random(keyLength/8).toString(CryptoJS.enc.Hex);
}

// ============================================================
// ADAPTAÇÃO: em vez de testar várias chaves candidatas,
// agora testamos o tempo de CRIPTOGRAFAR mensagens de
// tamanhos crescentes, usando sempre a mesma chave correta.
// ============================================================

const keyLength = 256;
const correctKey = generateCorrectKey(keyLength);

// Tamanhos de mensagem que serão testados (em número de caracteres)
// Mesmos tamanhos usados no teste do RSA, para permitir comparação direta
const tamanhosDeMensagem = [1000, 10000, 50000, 100000, 500000, 1000000, 2000000];

console.log("=== Teste AES: tempo de criptografia x tamanho da mensagem ===");
console.log("Tamanho da chave:", keyLength, "bits\n");

const resultados = [];

tamanhosDeMensagem.forEach((tamanho) => {
  // Gera uma mensagem "falsa" do tamanho desejado
  const message = "a".repeat(tamanho);

  const startTime = Date.now();
  const encryptedMessage = encryptAES(message, correctKey);
  const endTime = Date.now();

  const elapsedTime = endTime - startTime;
  resultados.push({ tamanho, tempo: elapsedTime });

  console.log(
    `Tamanho da mensagem: ${tamanho.toString().padStart(8)} caracteres` +
    ` -> Tempo: ${elapsedTime} ms`
  );
});

console.log("\nResultados em formato de tabela (para copiar):");
console.log("Tamanho da mensagem;Tempo (ms)");
resultados.forEach(r => console.log(`${r.tamanho};${r.tempo}`));