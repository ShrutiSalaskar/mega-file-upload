// Main module
function init() {
  const processor = new FileUploadProcessor();
  processor.clearFormData(); //to handle weird firefox issue

  // Update the file name input
  document.getElementById("fileInput").addEventListener("change", () => {
    processor.updateFileName();
  });

  // Listen for the upload button click
  document.getElementById("uploadButton").addEventListener("click", () => {
    if (processor.isFormValid()) {
      processor.addFileToUpload();
    }
  });
}

window.addEventListener("load", init);
