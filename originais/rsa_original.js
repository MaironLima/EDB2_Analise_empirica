const forge = require("node-forge");

// Função para gerar chaves RSA
function generateRSAKeyPair(keySize) {
  const rsa = forge.pki.rsa;
  const keyPair = rsa.generateKeyPair({ bits: keySize });
  return {
    publicKey: forge.pki.publicKeyToPem(keyPair.publicKey),
    privateKey: forge.pki.privateKeyToPem(keyPair.privateKey)
  };
}

// Função para criptografar usando RSA
function encryptRSA(message, publicKey) {
  const rsa = forge.pki.publicKeyFromPem(publicKey);
  const encrypted = rsa.encrypt(message, "RSA-OAEP");
  return Buffer.from(encrypted, "binary").toString("base64");
}

// Função para descriptografar usando RSA
function decryptRSA(ciphertext, privateKey) {
  const rsa = forge.pki.privateKeyFromPem(privateKey);
  const decrypted = rsa.decrypt(Buffer.from(ciphertext, "base64").toString("binary"), "RSA-OAEP");
  return decrypted;
}

// Função para testar várias chaves RSA
function testRSAKeys(ciphertext, keys) {
  const startTime = Date.now();
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const decryptedMessage = decryptRSA(ciphertext, key.privateKey);
      console.log("Mensagem descriptografada:", decryptedMessage);
      return;
    } catch (error) {
      continue;
    }
  }
  console.error("Nenhuma chave válida encontrada.");
}

// Função para gerar chaves aleatórias RSA
function generateRandomRSAKeys(numKeys, keySize) {
  const keys = [];
  for (let i = 0; i < numKeys; i++) {
    keys.push(generateRSAKeyPair(keySize));
  }
  return keys;
}

// Exemplo de uso
const message = "Mensagem secreta";
const numKeysToTest = 500;
const keySize = 2048;

const startTime = Date.now();

const randomKeys = generateRandomRSAKeys(numKeysToTest, keySize);

const { publicKey, privateKey } = generateRSAKeyPair(keySize);

const encryptedMessage = encryptRSA(message, publicKey);
console.log("Mensagem criptografada:", encryptedMessage);

testRSAKeys(encryptedMessage, randomKeys);

const endTime = Date.now();
const elapsedTime = endTime - startTime;
console.log("Tempo total de teste:", elapsedTime, "milissegundos");