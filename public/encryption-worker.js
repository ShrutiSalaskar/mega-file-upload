// Listen for messages from the main thread
importScripts("nacl-fast.min.js");
importScripts("asmcrypto.min.js");
self.addEventListener("message", function (event) {
  var fileData = event.data.fileData;
  var password = event.data.password;

  const sharedKey = 'YzNkN2E0MDVkYmM0ZmRjZiAgLQo=';
  const salt  = "user1234" + atob(sharedKey);

  // Generate a random nonce and key for symmetric encryption
  var nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  var key = asmCrypto.PBKDF2_HMAC_SHA256.bytes(password, salt, 65536, 32);

  // Convert the file data to a Uint8Array
  var fileDataArray = new Uint8Array(fileData);

  // Encrypt the file data using the nonce and key
  var ciphertext = nacl.secretbox(fileDataArray, nonce, key);

  // Calculate the MAC using HMAC-SHA-256
  var mac = asmCrypto.HMAC_SHA256.base64(asmCrypto.bytes_to_base64(nonce) + asmCrypto.bytes_to_base64(ciphertext), sharedKey);

  // Send the encrypted data back to the main thread
  self.postMessage({ ciphertext: ciphertext, nonce: asmCrypto.bytes_to_base64(nonce) , mac: mac});
});
