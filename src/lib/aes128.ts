import CryptoJS from "crypto-js";

export function uint8ArrayToWordArray(
  uint8Array: Uint8Array
): CryptoJS.lib.WordArray {
  const words: number[] = [];
  let i = 0;
  const len = uint8Array.length;
  while (i < len) {
    words[i >>> 2] |= uint8Array[i] << (24 - (i % 4) * 8);
    i++;
  }
  return CryptoJS.lib.WordArray.create(words, len);
}

function wordArrayToUint8Array(
  wordArray: ReturnType<typeof uint8ArrayToWordArray>
) {
  const len = wordArray.sigBytes;
  const u8_array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8_array[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8_array;
}

export function encrypt(key: Uint8Array, message: Uint8Array): Uint8Array {
  if (message.length % 16 !== 0) throw new Error("Incorrect message length");
  const messageWordArray = uint8ArrayToWordArray(message);
  const encrypted = CryptoJS.AES.encrypt(
    messageWordArray,
    uint8ArrayToWordArray(key),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding,
    }
  );
  return wordArrayToUint8Array(encrypted.ciphertext);
}

export function decrypt(key: Uint8Array, encryptedMessage: Uint8Array) {
  const encryptedWordArray = uint8ArrayToWordArray(encryptedMessage);

  const decrypted = CryptoJS.AES.decrypt(
    CryptoJS.lib.CipherParams.create({ ciphertext: encryptedWordArray }),
    uint8ArrayToWordArray(key),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding,
    }
  );

  return wordArrayToUint8Array(decrypted);
}

export function padMessageToBlockSize(message: Uint8Array, blockSize = 16) {
  const paddingLength = blockSize - (message.length % blockSize);
  if (paddingLength === blockSize) {
    return message;
  }
  const paddedMessage = new Uint8Array(message.length + paddingLength);
  paddedMessage.set(message);
  return paddedMessage;
}
