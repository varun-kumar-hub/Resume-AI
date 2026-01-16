
// Common stopwords and non-technical JD terms to ignore
const IGNORED_TERMS = new Set([
    "and", "the", "of", "in", "to", "a", "is", "for", "with", "on", "as", "by", "an", "are", "be", "or", "it",
    "at", "from", "that", "this", "which", "we", "you", "your", "can", "will", "have", "not", "but", "all",
    "skills", "experience", "role", "job", "description", "requirements", "knowledge", "proficiency", "strong",
    "ability", "years", "work", "team", "development", "design", "good", "excellent", "must", "preferred", "plus",
    "looking", "seeking", "responsible", "qualifications", "degree", "bachelors", "masters", "computer", "science",
    "engineering", "software", "application", "applications", "systems", "solutions", "environment", "environments",
    "code", "coding", "programming", "maintain", "maintaining", "debug", "debugging", "test", "testing",
    "deploy", "deploying", "implement", "implementing", "participate", "participating", "collaborate", "collaborating",
    "support", "supporting", "review", "reviews", "documentation", "documenting", "best", "practices", "familiarity",
    "understanding", "hands-on", "proven", "track", "record", "build", "building", "create", "creating",
    "new", "existing", "features", "functionality", "issues", "bugs", "root", "cause", "analysis",
    "performance", "scalability", "reliable", "efficient", "robust", "secure", "security", "high", "quality",
    "agile", "scrum", "kanban", "methodologies", "lifecycle", "sdlc", "deliver", "delivering", "ensure", "ensuring",
    "adhere", "adhering", "standards", "specifications", "user", "users", "customer", "customers", "client", "clients",
    "business", "technical", "functional", "non-functional", "requirements", "needs", "stakeholders",
    "communication", "written", "verbal", "interpersonal", "skills", "problem-solving", "analytical",
    "detail-oriented", "self-motivated", "independent", "team-player", "monitor", "monitoring",
    "optimize", "optimizing", "improve", "improving", "enhance", "enhancing", "platform", "platforms",
    "infrastructure", "architecture", "architectures", "patterns", "principles", "concepts", "technologies",
    "tools", "stacks", "frameworks", "libraries", "apis", "services", "microservices", "frontend", "backend",
    "fullstack", "web", "mobile", "desktop", "cloud", "devops", "database", "databases", "storage",
    "network", "networking", "protocols", "http", "https", "rest", "restful", "soap", "graphql",
    "json", "xml", "yaml", "html", "css", "javascript", "typescript", "java", "python", "c#", "c++",
    "go", "golang", "ruby", "php", "swift", "kotlin", "objective-c", "scala", "rust", "perl", "bash", "shell",
    "sql", "nosql", "mysql", "postgresql", "postgres", "mongodb", "mongo", "redis", "elasticsearch",
    "cassandra", "dynamodb", "oracle", "sqlserver", "sqlite", "mariadb", "firebase", "supbase",
    "aws", "azure", "gcp", "google", "cloud", "amazon", "web", "services", "microsoft", "docker",
    "kubernetes", "k8s", "jenkins", "gitlab", "github", "bitbucket", "jira", "confluence",
    "react", "angular", "vue", "svelte", "nextjs", "nuxtjs", "express", "flask", "django", "spring",
    "boot", "rails", "laravel", "asp.net", "core", "node", "nodejs", "deno", "jquery", "bootstrap",
    "tailwind", "material-ui", "semantic-ui", "foundation", "redux", "mobx", "context", "hooks",
    "class", "classes", "object", "objects", "oriented", "functional", "procedural", "imperative",
    "declarative", "components", "modules", "packages", "dependencies", "version", "control", "git",
    "svn", "mercurial", "ci/cd", "continuous", "integration", "deployment", "delivery", "pipeline",
    "pipelines", "automation", "automated", "manual", "unit", "integration", "e2e", "acceptance",
    "regression", "load", "stress", "performance", "security", "penetration", "access", "identity",
    "authentication", "authorization", "encryption", "hashing", "salt", "tokens", "jwt", "oauth",
    "sso", "saml", "openid", "connect", "basic", "digest", "adopt", "using", "use", "utilize", "consume"
]);

// Known tech dictionary to whitelist valid skills
// This ensures we capture "react" or "java" even if they are common words, but helps filter logic.
// Known tech dictionary to whitelist valid skills
// This ensures we capture "react" or "java" even if they are common words, but helps filter logic.
const TECH_DICTIONARY = new Set([
    "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "golang", "php", "swift", "kotlin", "rust", "scala", "perl", "r", "matlab", "assembly", "bash", "shell", "powershell",
    "html", "css", "sql", "nosql", "graphql", "xml", "json", "yaml", "markdown",
    "react", "reactjs", "angular", "vue", "vuejs", "svelte", "next.js", "nextjs", "nuxt.js", "nuxtjs", "ember", "backbone", "jquery", "bootstrap", "tailwind", "sass", "less", "material", "chakra",
    "node", "nodejs", "express", "nest", "nestjs", "django", "flask", "fastapi", "rails", "spring", "asp.net", ".net", "laravel", "symfony",
    "aws", "azure", "gcp", "google cloud", "firebase", "supabase", "heroku", "netlify", "vercel", "digitalocean",
    "docker", "kubernetes", "k8s", "jenkins", "circleci", "github actions", "gitlab ci", "travis", "terraform", "ansible", "chef", "puppet",
    "mysql", "postgresql", "postgres", "mongodb", "mongo", "redis", "elasticsearch", "cassandra", "dynamodb", "sqlite", "mariadb", "oracle", "sql server",
    "git", "svn", "mercurial", "bitbucket", "gitlab", "github", "version control",
    "jira", "confluence", "trello", "asana", "slack", "discord", "zoom", "teams",
    "linux", "unix", "windows", "macos", "android", "ios",
    "agile", "scrum", "kanban", "waterfall", "devops", "ci/cd", "tdd", "bdd", "oop", "functional programming", "mvc", "mvvm", "microservices", "serverless", "rest", "soap", "grpc", "websocket", "sdlc", "service oriented architecture",
    "machine learning", "deep learning", "ai", "artificial intelligence", "data science", "big data", "hadoop", "spark", "kafka", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "opencv",
    "blockchain", "crypto", "smart contracts", "solidity", "ethereum", "bitcoin",
    "cybersecurity", "penetration testing", "ethical hacking", "cryptography", "network security",
    "adobe", "photoshop", "illustrator", "xd", "figma", "sketch", "invision", "zeplin",
    "databases", "database", "relational database", "rdbms", "system design", "distributed systems"
]);

// Normalization map for tech skills (Case insensitive input -> Normalized output)
const SKILL_NORMALIZE: Record<string, string> = {
    "js": "javascript",
    "ts": "typescript",
    "reactjs": "react",
    "react.js": "react",
    "node.js": "node",
    "nodejs": "node",
    "vue.js": "vue",
    "vuejs": "vue",
    "golang": "go",
    "postgres": "postgresql",
    "k8s": "kubernetes",
    "py": "python",
    "ui": "user interface",
    "ux": "user experience",
    "cicd": "ci/cd",
    "ci-cd": "ci/cd",
    "ci/cd": "ci/cd",
    "next.js": "nextjs",
    "c++": "c++",
    "cpp": "c++",
    "c#": "c#",
    "csharp": "c#",
    ".net": ".net",
    "dotnet": ".net",
    "ml": "machine learning",
    "ai": "artificial intelligence",
    "aws": "aws",
    "gcp": "gcp",
    "azure": "azure"
};

export interface JDMatchResult {
    score: number;
    verdict: 'Strong Match' | 'Good Match' | 'Partial Match' | 'Weak Match';
    matchedKeywords: string[];
    missingKeywords: string[];
    details: {
        totalKeywordsFound: number;
        coverage: number;
    };
}

/**
 * Normalizes text: lowercases, removes special chars (keeping +, #, ., / for C++, C#, .NET, CI/CD etc)
 */
function normalizeToken(token: string): string {
    const raw = token.toLowerCase().trim();
    return SKILL_NORMALIZE[raw] || raw;
}
/**
 * Robust Keyword Extraction
 * Uses a Hybrid Strategy:
 * 1. REGEX Phrase Matching: Iterates through dictionary to find multi-word skills ("version control", "google cloud").
 * 2. TOKEN Normalization: Splits text to handle mapped terms ("js" -> "javascript", "react.js" -> "react").
 */
function extractKeywords(text: string): Set<string> {
    const validKeywords = new Set<string>();

    // Normalize text for search: lowercase
    const searchSpace = text.toLowerCase();

    // --- STRATEGY 1: Phrase Matching (Dictionary Scan) ---
    // Good for: "version control", "ci/cd", "google cloud"
    TECH_DICTIONARY.forEach(skill => {
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match whole words/phrases only
        const pattern = new RegExp(`(^|[^a-z0-9])(${escapedSkill})([^a-z0-9]|$)`, 'i');

        if (pattern.test(searchSpace)) {
            validKeywords.add(skill);
        }
    });

    // --- STRATEGY 2: Token Normalization ---
    // Good for: "js" -> "javascript", "reactjs" -> "react"
    // Also captures terms that might be missed by regex boundaries if they are attached to symbols differently.

    // We replace common separators with spaces to handle "React/Redux" -> "React Redux"
    const cleanedText = text.replace(/[\/\,\(\)]/g, ' ');
    const tokens = cleanedText.split(/\s+/)
        .map(t => t.trim())
        .map(t => normalizeToken(t)) // Normalize! "js" -> "javascript"
        .filter(t => t.length > 0);

    tokens.forEach(token => {
        // If the normalized token is in dictionary, add it!
        if (TECH_DICTIONARY.has(token)) {
            validKeywords.add(token);
        }
        // Heuristics for unknown tech like "html5"
        else if (/^[a-z]+[0-9]+$/.test(token) && !IGNORED_TERMS.has(token)) {
            validKeywords.add(token);
        }
    });

    return validKeywords;
}

import { ParsedResume } from "./resume-parser";

export function calculateJDMatch(resume: ParsedResume, jdText: string): JDMatchResult {
    const resumeTextCombined = [
        resume.text,
        ...resume.sections.map(s => s.content)
    ].join(' ');

    const jdKeywords = extractKeywords(jdText);
    const resumeKeywords = extractKeywords(resumeTextCombined);

    // Intersection
    const matched: string[] = [];
    const missing: string[] = [];

    jdKeywords.forEach(kw => {
        if (resumeKeywords.has(kw)) {
            matched.push(kw);
        } else {
            missing.push(kw);
        }
    });

    const total = jdKeywords.size;

    if (total === 0) {
        return {
            score: 0,
            verdict: 'Weak Match',
            matchedKeywords: [],
            missingKeywords: [],
            details: { totalKeywordsFound: 0, coverage: 0 }
        };
    }

    const coverage = matched.length / total;
    let score = Math.round(coverage * 100);

    // Bonus for partial matches or high key count
    if (matched.length > 5 && score < 50) score += 10;

    let verdict: JDMatchResult['verdict'] = 'Weak Match';
    if (score >= 80) verdict = 'Strong Match';
    else if (score >= 60) verdict = 'Good Match';
    else if (score >= 40) verdict = 'Partial Match';

    return {
        score: Math.min(100, score),
        verdict,
        matchedKeywords: matched.sort(), // Alphabetical
        missingKeywords: missing.sort(),
        details: {
            totalKeywordsFound: total,
            coverage: Math.round(coverage * 100) / 100
        }
    };
}
