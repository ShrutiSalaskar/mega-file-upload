# Mega File Upload
This repository includes a straightforward web-based user interface for file uploads. The UI is designed based on a given mockup and facilitates the uploading of encrypted files to a local server running on Node.js with Express and Multer.

## Local Setup
To run this repository, Node.js runtime version 16 or above is required. Versions below 16 do not have the global methods for `atob` and `btoa` which are utilized in the asmcrypto library.

To get started, navigate into the folder and execute the following commands to launch the server on port 3000. If you prefer to run it on a different local port, you can modify line 7 of the `server.js` file.
```sh
npm install
npm start
```

## Directories and Files
To keep the project simple and avoid creating multiple directories, the structure of the repository is as follows:

- The `server.js` file in the root directory contains the Node.js server code responsible for handling single file uploads via the `/POST` route.
- The `public` folder holds all the client-side code, including HTML, CSS, JS, and vendor files.
- The `index.html` file serves as the main and only HTML file for this project.
- The `styles.css` file contains the custom CSS code that I have written.
- The `init.js` file is the main JavaScript file that initializes the application.
- The `file-upload.js` file contains the logic for handling a single file upload.
- The `file-upload-processor.js` file includes code for managing form elements, performing validations, and processing file uploads sequentially.
- The `encryption-worker.js` file is a web worker that offloads the encryption process from the main thread.

## Vendor Files
To perform cryptographic operations as specified in the assignment document, the project utilizes two libraries: `asmcrypto.min.js` and `nacl-fast.min.js`. These libraries provide the necessary functionalities for cryptographic operations within the application.

 By using `normalize.css` which helps to ensure consistent rendering across different web browsers by normalizing default styles and behaviors, the project achieves a more consistent and predictable CSS styling experience.

## Time Taken and Approach
In total, the project took approximately 4 hours to complete, excluding the time spent on documentation. Here's a breakdown of the time spent on different aspects of the project:

- 1.5 hours were dedicated to writing the HTML and CSS code. The main container's layout was implemented using flexbox to ensure responsiveness, while the right-section utilized grid to display multiple rows of files.
- 2 hours were spent on developing the upload functionality. This involved dividing the functionality into two sections: file upload for individual files and handling forms to control the overall flow of the application.
- 0.5 hours were allocated to the server and encryption logic. Minimal effort was put into this aspect as the code provided in the assignment PDF was used. The only addition was the implementation of logic to verify the HMAC using the methods outlined in the PDF.

Overall, the project's completion time was distributed among these different tasks, resulting in the final implementation.

While the implemented functionality closely aligns with the requirements, it should be noted that certain aspects were omitted due to time constraints, and these decisions were made consciously. One such area is error handling, which could have been improved to provide a more robust user experience. Additionally, the feature to re-upload files in case of failures was not implemented within the given timeframe. I opted to use SHA256 instead of SHA512 for cryptographic hashing calculation of HMAC. This decision was influenced by the limitations of the library I utilized, which only supported SHA256. Considering time constraints, I chose not to invest additional effort in researching and integrating a different library that supports SHA512.
