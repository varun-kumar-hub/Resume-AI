const pdf = require('pdf-parse');

async function testPdf() {
    console.log('Testing pdf-parse (v1.1.1)...');
    console.log('Type of pdf:', typeof pdf); // Should be 'function'

    // Create a dummy PDF buffer (minimal valid PDF)
    const pdfData = `%PDF-1.7
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 24 Tf
100 700 Td
(Hello World) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000207 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
301
%%EOF`;

    const buffer = Buffer.from(pdfData);

    try {
        const data = await pdf(buffer);
        console.log('Success! Parsed text:', data.text.trim());
    } catch (error) {
        console.error('Error parsing PDF:', error);
    }
}

testPdf();
