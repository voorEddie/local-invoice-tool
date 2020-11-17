import CryptoJS from 'crypto-js'

export function encrypt(state, key) {
  return CryptoJS.AES.encrypt(JSON.stringify(state), key).toString()
}

export function decrypt(cipher, key) {
  const bytes = CryptoJS.AES.decrypt(cipher, key)
  const bytesString = bytes.toString(CryptoJS.enc.Utf8)

  if (bytesString === '') {
    throw new Error('Decryption failed due to key mismatch.')
  }

  return JSON.parse(bytesString)
}
