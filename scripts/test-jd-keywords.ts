
import { calculateJDMatch } from '../src/lib/jd-analysis';
import { ParsedResume } from '../src/lib/resume-parser';

const mockResume: ParsedResume = {
    text: "I have experience with Java, Python, and React. I am a Frontend Engineer with strong communication skills.",
    sections: [],
    // @ts-ignore - metadata might be optional or different in actual type, ignoring for test script simplicity
    metadata: {
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        website: "",
    },
    skills: []
};

const jdText = `
We are looking for a likely Frontend Engineer.
Experience with React and TypeScript is required.
Must have strong communication skills and understand Backend concepts.
Knowledge of REST API is a plus.
`;

const result = calculateJDMatch(mockResume, jdText);

console.log("JD Text:", jdText);
console.log("Extracted Keywords from JD:", result.details.totalKeywordsFound);
console.log("Matched Keywords:", result.matchedKeywords);
console.log("Missing Keywords:", result.missingKeywords);

const allDetected = [...result.matchedKeywords, ...result.missingKeywords];
console.log("All Detected Keywords:", allDetected);
