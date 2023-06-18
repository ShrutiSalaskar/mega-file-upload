function FileUpload(file, password, id) {
  this.file = file;
  this.password = password;
  this.id = id;
  this.fileName = file.name;
  this.fileData = null;
}

FileUpload.prototype.getFormattedDate = function () {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};

FileUpload.prototype.addUploadingFilesInUI = function () {
  const parentDiv = document.getElementById("uploadedFiles");

  const html = `<div class="grid-container">
      <div class="row-item">${this.getFormattedDate()}</div>
      <div class="row-item" id="file-name-${this.id}">${""}</div>
      <div class="row-item">
        <div class="progress-bar">
          <div id="progress-${this.id}" class="progress"></div>
        </div>
      </div>
      <div class="row-item" id="file-name-${this.id}-status">
      </div>
    </div>`;

  parentDiv.innerHTML += html;
  const fileNameElem = document.getElementById(`file-name-${this.id}`);
  if (fileNameElem) {
    fileNameElem.textContent = this.fileName;
  }
};

FileUpload.prototype.readFile = function () {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();

    reader.onload = (event) => {
      var fileData = event.target.result;
      this.fileData = fileData;
      // Call the function to encrypt the file
      resolve(fileData);
    };

    reader.onerror = function (event) {
      console.log("Error reading the file:", event.target.error);
      reject(event.target.error);
    };

    reader.readAsArrayBuffer(this.file);
  });
};

FileUpload.prototype.encryptFile = function () {
  return new Promise((resolve, reject) => {
    // Use web worker to perform the encryption asynchronously
    var worker = new Worker("encryption-worker.js");

    worker.onmessage = (event) => {
      var encryptedData = event.data.ciphertext;
      var nonce = event.data.nonce;
      var mac = event.data.mac;

      this.encryptedData = encryptedData;
      this.nonce = nonce;
      this.mac = mac;
      worker.terminate();
      resolve({});
    };

    worker.onerror = (event) => {
      console.log("Error encrypting the file:", event);
      reject(event);
    };

    worker.postMessage({ fileData: this.fileData, password: this.password });
  });
};

FileUpload.prototype.uploadFailedUi = function (progress, imageContainer) {
  console.error("Error occurred during file upload");
  progress.style.backgroundColor = "red";
  progress.style.width = "100%";
  const reUploadImage = document.createElement("img");
  // Used base64 image to display images without breaking when offline.
  reUploadImage.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAZCAYAAAAmNZ4aAAADh0lEQVRIDcVWS2gTURSdN/n3Y1WqiFUo2o0LLbQL6SakSSbaiiupu6qgG0FEFIv4qbXalQp1I7pWq1iFLkQwmdCxEUWwuKkfEDctqIhU0HyaNJnneWkmvnmTX+3CC+Xde+7nzLx756aS9J+ELIc34fd3ELu9T6K0G3mthBAP9B9Ukl7DHq+LRCZwwqwuNRHHg8HtNkJGJUL8QskMiDUwPQU+Syid9qjqrBBT0qxKnAyFTqPgCEgdxQoUQsgY0fWztRIVcwtKReJUKHQTcUeFpCTV9QN1qvpYwJdl2stFp4LBM/CZSSlN4U39IGU9XZHIpbLjihKQZHnE4qP0SF04XBNp0uvdnFSUU5YaBaAUMZEJuQ6/yYcBmkA/x8oV4nFGSlwuDVN/LREKXeF9hm4qzkAM0z40vt0IME70ddjQK51Jn28TcbsnMYxbWBwIziWCwctijoUYn8d+MQjYTL2qvrXgApAndTo1wFt5lyzL5xOKYnpwE/FDSbIhQeGTmI6BmhQx0U76/S3E6WRxJlIjDu27APJLRdtQ2Nnr861DX1bzWF6n9LMF44A8qd2uAWrjYIsK8kH0fIg5TJ8TtdvXWKIBYLDSn9raXPVNTTaH222bcThS3ZqWZbFvOjsdWKODUOfYH2KbMCMdzCfIO9jfccVefDUhgnW4Cz24g+3khMOJofAICWYTK/Ln/PyejdPTSbNjyUK9oE2WI6Ivp+u7G1T1mYHLBeM4CBuqkWJRPq9EyoriJZqN4vyJXHYjRckPF5bCAzj6geaKHkFhpL8IKfumRjiu2WvoxoncL43R6AfDZmeemCn4SbsvYQdDtZAjcYqRbgiHEyy2nAwt1esR/RjYJ8DQ/r9SJGZQfjPlcgehFskRHQNpbzVSlj8QCPThaGU6J3o2l7vB2XnVRMwQTzR6DwvjEFQdb/oinsnURDrX1eUhsnyR1eAFNR7hmt/zGNMtxAz0RCJ3wbo3vrjYs17T4gyrJmsbG29hOLfxcbitb3Rh4QSPGTpmYWUyhIcfUJSr6ONJUyVKs3iQgCccnjLhBcO0QEoFVMIKv0K3QSAO1O8cpX0NkUhJUlbzn944HgjskG22fiydYyB18w+H632ZzWQOr9K0jzwu6jUTp3y+VupwDKOAH9faIhYC4St8jqP472QcPpiVpWbiQhmCPduOpJ0ypc2ongY+S9PpWH0s9rUyldn7By9jP6336x9vAAAAAElFTkSuQmCC";
  imageContainer.appendChild(reUploadImage);
};

FileUpload.prototype.onUploadSuccess = function (imageContainer) {
  console.log("File uploaded successfully");
  const tickImage = document.createElement("img");
  tickImage.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAyCAYAAAAA9rgCAAAEtElEQVRoBe1Zb2gcRRSfmd2tlAgVWsvVD1WKBa1+UopQ0dwlsZSqFcVWAhUL0pLc1VC/WOjdhfX+FC3inzTNxUKlghhopaJUsGkut6GfpBQEP0i/iJ8kiSi2tWq83Xm+sdnL5bI3+yeX7RV2P2Rm3nvz3vu93+zs3ISQ6IkqEFUgqkBUgagCUQWiCoRUARpSnJaE0c/oq7T1sTGL86HBruRUEKcsyKTbMWf3md2KAEsoeYkxej43OfxEkDzuCIZ1XWdaPPYpgt1rgwQgf1CwEulE6ntb5qW9IxhW47FSPVgBjFJyD2FsXK8cf8gLUNum7QEXjdL7CO6AnfDilt6rMbWsT4xsWixvPmprwHmjlEMq32yevtDQ+zSVnpbbLGjVhW579QpG6S1KadYtKyAwCxz2u9nZ+rZkOF8ZSSHYd+0km7VAyO9mFZ7JdiWvNrNplLfdLl2slPYRRj/BRN1yu2GB1T0YT11uBCUbuzmVzW25LjdV2qMA/RyhKjLnyOxfHPiOwXjykszOSdc2gPOV0nN4oDiHSWpOidZkAHPc4ruy3anxmsxHJ/CmVSif2EZUljT5zD49oZs+Yi4xfXtyuJtR8gUqpGABwCScvhIUrAgsXTpLMpsXFMvDj1FFHceNZSsjHZuffmDrl4Zh4Erz/+QmS0+qTPkGPz+rZbNxN+b4Wr+aSfSJwgR+fO/S+sToFlDUC/ierRFREXSvmlh/UnT9ZpGbHHlcYRTBkg6XuQCcHsjE+8Zc7FzVvgDrlRMPqhqZwJPPunrPlLDX8bv5Yb3MrY+H/0cQbK1wMntcyoeyib5TMhuvOs+A9YsfbdSYUkYaNzg5R6YHEHTRSdcoy0+NbmZMmcDlsbZR1zhGatOZeP9Qozzo2DNgTVv1GQbZKAuEoI8UjJEjMptCefh+DIqrhMZkdkKHzB7NxJNH3ez86D0DrgJJYga/uTmnlBWR6QEnu+K3H2ygCjLrUjgxF8EOIbNpJz/LkfnaaG5tMqxsb1iSwMA52V//3umV99ZprGMK97Ytknn/q4DwU5nOpDgfB9r5Zf49Myyc4LXKFYvDs5jGTZlT1CHRcLJgjPYKu8MX31mjsrsveAILMGZWZsXPwZaDFbn4YlhMEI84KMx/O++6JXH+Kw4KnMJrjNAUJXSbs9WCFL+1X+FB5uXlHmQWPC7tBQIs3Hg+Ci6N6ShBOsdnbv676/jOgTlHgxYJfS3p+pjZRP95i8BeXHhWvTxQH+CSeX36xZUGK3ILzLANzMfPOXvK4hbg8rVr17uPvXD4xmLFyowCM2ynk070n+acv2GP/bR48/hD9Z+/d4QFVuS2bIZtgPNXMq63FLY9bmhXqTnXme45NGPLwmiXzbCdJB4SjnGAvD2WtgA/m1DtCRusyKllDNsAxbUqfoUlN43wS7UKT+k9yZ/sOWG2LQcskscDx8fOd8nwKye8M9uZ+jFMkPWxWrak652axnQ/fq7Ej43aI/41QjjffjvBimQC3XjUUDTpiNuPtTtXfx3r2PQovjQP4wb1J+fW9mzXwStNpoQmXhGGRfZn95y1qrPTvcj0OWT3+cGug9+FhioKFFUgqkBUgagCUQWiCkQVaIcK/AdAB3YVffJN+QAAAABJRU5ErkJggg==";
  imageContainer.appendChild(tickImage);
};

FileUpload.prototype.uploadFileToServer = function () {
  return new Promise((resolve, reject) => {
    if (this.encryptedData) {
      // Create a new Blob object with the encrypted data
      var encryptedFile = new Blob([this.encryptedData]);

      var formData = new FormData();
      formData.append("file", encryptedFile, this.fileName);
      formData.append("nonce", this.nonce);
      formData.append("mac", this.mac);

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/upload", true);

      const progress = document.getElementById(`progress-${this.id}`);
      const imageContainer = document.getElementById(
        `file-name-${this.id}-status`
      );

      xhr.upload.onprogress = function (event) {
        var percentage = Math.round((event.loaded / event.total) * 100);
        progress.style.width = percentage + "%";
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 400) {
          this.onUploadSuccess(imageContainer);
          resolve();
        } else {
          this.uploadFailedUi(progress, imageContainer);
          reject();
        }
      };

      xhr.onerror = () => {
        this.uploadFailedUi(progress, imageContainer);
        reject();
      };

      xhr.send(formData);
    }
  });
};
