/* This class is responsible for performing two tasks: 
validating the form data and processing the files in the queue sequentially.*/

function FileUploadProcessor() {
  this.queue = [];
  this.erroredFiles = [];
  this.nextId = 1;
  this.isProcessing = false;

  this.fileInput = document.getElementById("fileInput");
  this.fileNameInput = document.getElementById("fileNameInput");
  this.passwordInput = document.getElementById("passwordInput");
  this.uploadButton = document.getElementById("uploadButton");
}

FileUploadProcessor.prototype.updateFileName = function () {
  this.fileNameInput.value = this.fileInput?.files[0]?.name || "";
};

FileUploadProcessor.prototype.showErrorElem = function (elem, text) {
  const errorELem = document.createElement("p");
  errorELem.className = "error-message";
  errorELem.textContent = `${text}`;
  elem.parentNode.appendChild(errorELem);
};

FileUploadProcessor.prototype.clearErrorMessages = function () {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorElement) => {
    errorElement.parentNode.removeChild(errorElement);
  });
};

FileUploadProcessor.prototype.isFileSizeValid = function () {
  const file = this.fileInput?.files[0];
  if (file && file?.size < 20971520) {
    // (20* 1024 * 1024 = 20MB)
    return true;
  }
  return false;
};

FileUploadProcessor.prototype.isFormValid = function () {
  // return true;
  let isValid = true;
  this.clearErrorMessages();

  if (this.passwordInput.value.trim() === "") {
    this.showErrorElem(this.passwordInput, "Password is required!");
    isValid = false;
  }

  if (!this.fileInput.files || this.fileInput.files.length === 0) {
    this.showErrorElem(this.fileInput, "File upload is required!");
    isValid = false;
  }

  if (this.fileInput?.files?.length !== 0 && !this.isFileSizeValid()) {
    isValid = false;
    this.showErrorElem(this.fileInput, "File Size > 20 MB");
  }

  return isValid;
};

FileUploadProcessor.prototype.clearFormData = function () {
  // reset the file input
  this.fileInput.value = "";
  this.fileNameInput.value = "";
};

FileUploadProcessor.prototype.addFileToUpload = function () {
  // disable the upload button for few seconds to avoid too many upload clicks.
  this.uploadButton.disabled = true;
  setTimeout(() => {
    this.uploadButton.disabled = false;
  }, 3000);

  const id = this.nextId++;
  const file = this.fileInput.files[0];
  const password = this.passwordInput?.value;

  if (!password) {
    return;
  }

  const fileUpload = new FileUpload(file, password, id);
  fileUpload.addUploadingFilesInUI();
  this.queue.push(fileUpload);
  this.processFiles();
  this.clearFormData();
};

FileUploadProcessor.prototype.processFiles = function () {
  if (this.isProcessing === true || this.queue.length === 0) {
    return;
  }
  this.isProcessing = true;

  const processNextFile = () => {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    const fileUpload = this.queue.shift();

    fileUpload
      .readFile()
      .then(() => fileUpload.encryptFile())
      .then(() => fileUpload.uploadFileToServer())
      .then(processNextFile) // Recursively process the next file
      .catch((error) => {
        console.log(error);
        this.erroredFiles.push(fileUpload); // to hold errored files to process later
        processNextFile(); // Proceed to the next file even if an error occurs
      });
  };

  processNextFile();
};
