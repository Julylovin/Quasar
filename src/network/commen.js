import CryptoJS from 'crypto-js'
function cutBracketsContent(string) {
  // 切割掉字符串中 括号及其内容
  if (string.indexOf("(") !== -1 && string.indexOf(")") !== -1) {
    string = string.split("(")[0] + string.split(")")[1];
  } else {
    return string;
  }
  return string;
}
function encrypt (text, key = 'DRD80D4FDEB67EC851B3FF15142443FC') {
  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).ciphertext.toString(CryptoJS.enc.Base64)
}
function decrypt (text, key = 'DRD80D4FDEB67EC851B3FF15142443FC') {
  return CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, iv: '' }).toString(CryptoJS.enc.Utf8) || false
}
export default {
  cutBracketsContent,
  encrypt,
  decrypt
};
