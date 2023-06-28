
const CryptoJS = require('crypto-js');
const murmur = require('murmurhash-js');

var SecretKey = CryptoJS.SHA512("Hello").toString(); //Hello is client key
  

console.log(SecretKey);

  const n=murmur.murmur2("Hi Bro",71287)%2087+1000; //Hi Bro is process.env.ServerKey
  for (let i=0;i<n;i++)
  {
	SecretKey = CryptoJS.SHA512(SecretKey).toString();
  }
console.log(SecretKey);



