/************************************************
 
Argon2i hashing algorithm ( designed to be memory hard ) 
is used for hashing the Secret key 

Input : Secret key , Client key
Process : 
1. Taking the two parameters as input 
2. generating salt using the client key 
3. hashing the salt using murmur hash function 
4. then using argon2i hash function ( Server key + salt ) as argument 
   to generate a new Secret key

****************************************************/

const CryptoJS = require('crypto-js');
const murmur = require('murmurhash-js');
const argon2 = require('argon2');

async function hashSecretKey(SecretKey, ClientKey) {
  try {
    
    // Generating salt using client key and Secret key 
    const halfClientKey = ClientKey.slice(0, 32);
    var Salt = CryptoJS.SHA512(process.env.ServerKey + halfClientKey).toString();
    const n = (murmur.murmur2(process.env.ServerKey, 71287) % 2087) + 1000;

    // Hashing the Salt using Crypto SHA512 //
    for (let i = 0; i < n / 2; i++) {
      Salt = CryptoJS.SHA512(Salt).toString();
    }
    // Hashing the Secret key using argon2i
    const hash = await argon2.hash(SecretKey, {
      type: argon2.argon2i,
      salt: Buffer.from(Salt),
    });

    return hash;

  } 
  catch (error) {
    console.error("Error hashing password:", error);
  }
}

module.exports = hashSecretKey