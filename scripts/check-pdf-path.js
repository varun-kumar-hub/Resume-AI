const pdfLib = require('pdf-parse/lib/pdf-parse.js');

console.log('Type of pdfLib:', typeof pdfLib);
if (typeof pdfLib === 'function') {
    console.log('Success! pdfLib is a function');
} else {
    console.log('Keys:', Object.keys(pdfLib));
}
