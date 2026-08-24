const forge = require("node-forge");

// Função para gerar chaves RSA
function generateRSAKeyPair (keySize) {
  const rsa = forge.pki.rsa;
  const keyPair = rsa.generateKeyPair({ bits: keySize });
  return {
    publickey: forge.pki.publicKeyToPem (keyPair.publicKey),
    privatekey: forge.pki.privateKeyToPem (keyPair.privateKey)
  };
}

// Função para criptografar usando RSA
function encryptRSA (message, publickey) {
  const rsa = forge.pki.publicKeyFromPem (publickey);
  const encrypted = rsa.encrypt (message, "RSA-OAEP");
  return Buffer.from(encrypted, "binary").toString("base64");
}

// Função para descriptografar usando RSA
function decryptRSA (ciphertext, privateKey) {
  const rsa = forge.pki.privateKeyFromPem (privateKey);
  const decrypted = rsa.decrypt(Buffer.from(ciphertext, "base64").toString("binary"), "RSA-ΟΑΕΡ");
  return decrypted;
}

// Função para testar várias chaves RSA
function testRSAKeys (ciphertext, keys) {
  const startTime = Date.now();
  for (let i=0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const decryptedMessage = decryptRSA (ciphertext, key.privateKey);
      console.log("Mensagem descriptografada:", decryptedMessage);
      return; // Encerra a função se a mensagem for descriptografada com sucesso
    } catch (error) {
      // Se a decifragem falhar, continua para a próxima chave
      continue;
    }
  }
  // Se nenhuma chave funcionar, lança um erro
  console.error("Nenhuma chave válida encontrada.");
}

// Função para gerar chaves aleatórias RSA
function generateRandomRSAKeys (numKeys, keySize) {
  const keys = [];
  for (let i=0; i < numKeys; i++) {
    keys.push(generateRSAKeyPair(keySize));
  }
  return keys;
}

// Exemplo de uso
const message = "Mensagem secreta";
const numKeysToTest = 500;
const keySize = 2048; // Tamanho da chave RSA em bits

// Iniciar a medição do tempo
const startTime = Date.now();

// Gerar chaves aleatórias para teste
const randomkeys = generateRandomRSAKeys (numKeysToTest, keySize);

// Criar uma chave pública e privada RSA para o exemplo
const { publickey, privateKey } = generateRSAKeyPair(keySize);

// Criptografar a mensagem com a chave pública
const encryptedMessage = encryptRSA (message, publickey);
console.log("Mensagem criptografada:", encryptedMessage);

// Testar várias chaves para descriptografar a mensagem
testRSAKeys (encryptedMessage, randomkeys);

// Calcular o tempo decorrido em milissegundos
const endTime = Date.now();
const elapsedTime = endTime - startTime;

// Exibir o tempo total de teste
console.log("Tempo total de teste:", elapsedTime, "milissegundos");