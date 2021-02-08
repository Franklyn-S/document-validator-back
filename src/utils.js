function convertb64StringToBlob(b64Data, contentType = "octet/stream") {
  const sliceSize = 512;
  const byteCharacters = Buffer.from(b64Data, "base64");
  const byteArrays = [];
  let slice;
  let byteNumbers;
  let byteArray;
  let blob = "";
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    slice = byteCharacters.slice(offset, offset + sliceSize);
    byteNumbers = Array.from({ length: slice.length });
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

module.exports = convertb64StringToBlob;
