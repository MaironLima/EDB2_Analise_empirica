// Importando a biblioteca CryptoJS
const CryptoJS = require("crypto-js");

// Função para criptografar usando AES
function encryptAES(message, key) {
  const config = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  };
  const encrypted = CryptoJS.AES.encrypt(message, key, config);
  return encrypted.toString();
}

// Função para descriptografar usando AES
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

// Função para gerar chaves aleatórias
function generateRandomKeys(numKeys, keyLength) {
  const keys = [];
  for (let i = 0; i < numKeys; i++) {
    const key = CryptoJS.lib.WordArray.random(keyLength/8).toString(CryptoJS.enc.Hex);
    keys.push(key);
  }
  return keys;
}

// Função para gerar uma chave correta
function generateCorrectKey(keyLength) {
  return CryptoJS.lib.WordArray.random(keyLength/8).toString(CryptoJS.enc.Hex);
}

// Exemplo de uso
const message = "Mensagem secreta";
const keyLength = 256;

const correctKey = generateCorrectKey(keyLength);
console.log("Chave correta:", correctKey);

const startTime = Date.now();

const numKeysToTest = 1000000;
const randomKeys = generateRandomKeys(numKeysToTest, keyLength);
randomKeys.push(correctKey);

const encryptedMessage = encryptAES(message, correctKey);
console.log("Mensagem criptografada:", encryptedMessage);

try {
  const decryptedMessage = decryptAES(encryptedMessage, randomKeys);
  if (decryptedMessage) {
    console.log("Mensagem descriptografada:", decryptedMessage);
  } else {
    throw new Error("Erro ao descriptografar a mensagem: Nenhuma mensagem decifrada encontrada.");
  }
} catch (error) {
  console.error(error.message);
}

const endTime = Date.now();
const elapsedTime = endTime - startTime;
console.log("Tempo decorrido:", elapsedTime, "milissegundos");