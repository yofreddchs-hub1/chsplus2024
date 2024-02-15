import crypto from 'crypto-js';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
const jwt= require('jsonwebtoken');
// const key='CHS_W3S1P4Y_InG.Y0Fr3dD';
const key='W3S1-Ch5_4p15@53RvEr';
// const algorithm = 'aes-256-ctr';
// const IV_LENGTH = 16;

export const encriptado = {
  Hash_texto,
  Hash_password,
  Encriptado,
  desencriptado,
  Hash_chs,
  Codigo_chs
};

async function Encriptado(texto){
  var ciphertext = crypto.AES.encrypt(texto, key).toString();
  return ciphertext
  // if ([null,'null'].indexOf(texto)!==-1) return null
  // let iv = crypto.randomBytes(IV_LENGTH);
  // const Key = crypto
  //       .createHash("sha256")
  //       .update(key)
  //       .digest()
  // let cipher = crypto.createCipheriv(algorithm, Key, iv);
  // let encrypted = cipher.update(texto);
  // encrypted = Buffer.concat([encrypted, cipher.final()]);
  // return iv.toString('hex') + ':' + encrypted.toString('hex');
}

async function desencriptado(texto){
  var bytes  = crypto.AES.decrypt(texto, key);
  var originalText = bytes.toString(crypto.enc.Utf8);
  return originalText
  // if ([null,'null'].indexOf(texto)!==-1) return null
  // const Key = crypto
  //   .createHash("sha256")
  //   .update(key)
  //   .digest()
  // let textParts = texto.split(':');
  // let iv = Buffer.from(textParts.shift(), 'hex');
  // let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  // let decipher = crypto.createDecipheriv(algorithm, Key, iv);
  // let decrypted = decipher.update(encryptedText);
  // decrypted = Buffer.concat([decrypted, decipher.final()]);
  // return decrypted.toString();
}

async function Hash_texto(texto) {
  // const hash = crypto.createHash('sha512');
  // await hash.update(key + texto);
  // const resultado = await hash.digest('hex');
  var resultado = await crypto.SHA512(key + texto);
  resultado = resultado.toString(crypto.enc.Hex)
  return resultado;

}

async function Hash_password(texto) {
  // const hash = crypto.createHash('sha256');
  // await hash.update(key + texto);
  // const resultado = await hash.digest('hex');
  let resultado = await crypto.SHA256(key + texto);
  resultado = resultado.toString(crypto.enc.Hex)
  return resultado;

}

async function Hash_chs(valor){
  // const valores= global.valoreschs;
  let nuevo = {};
  Object.keys(valor).map(val=>{
    if (['hash_chs'].indexOf(val)===-1){
      nuevo= {...nuevo, [val]:valor[val]};
    }
  })
  // console.log('nuevo',nuevo);
  // var token = jwt.sign(nuevo, valores.KEY);
  var token = await Encriptado(JSON.stringify(nuevo));
  return token;
}
async function Codigo_chs(valor){
  return await Hash_password(JSON.stringify(valor));
}