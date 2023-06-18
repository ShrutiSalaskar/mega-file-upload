const fs = require("fs");
const express = require("express");
const multer = require("multer");

const asmCrypto = require("./public/asmcrypto.min.js");
// change this to any port you like if 3000 is already in use.
const port = 3000 || process.env.PORT;

const app = express();

const sharedKey = "YzNkN2E0MDVkYmM0ZmRjZiAgLQo=";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    // Use the original filename with a timestamp prefix
    const uniquePrefix = Date.now() + "-";
    cb(null, uniquePrefix + file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.static("./public"));

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const { file, body } = req;
  const uploadedFilePath = file.path;
  const { nonce, mac } = body;
  const fileData = fs.readFileSync(uploadedFilePath);

  // Calculate the message authentication code using HMAC-SHA-256
  // this should not run on main thread, doing this for demo.
  const hmac = asmCrypto.HMAC_SHA256.base64(
    nonce + asmCrypto.bytes_to_base64(fileData),
    sharedKey
  );

  // Compare the calculated MAC with the received MAC
  if (hmac === mac) {
    res.status(200).send("File uploaded successfully.");
  } else {
    res.status(401).send("Invalid MAC");
  }
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
