/* eslint-env node */

// List of abusive/profane words (Hindi and English).
// NOTE: Keep this list focused on clearly abusive terms only,
// to avoid flagging normal text like names, classes, or feedback.
const PROFANE_WORDS = [
  // English abusive words (clearly offensive only)
  "fuck", "fucking", "fucked", "fucker",
  "shit", "shitting", "shitted", "shyt",
  "asshole", "assholes",
  "bitch", "bitches",
  "bastard", "bastards",
  "piss", "pissing", "pissed",
  "dick", "dicks",
  "cock", "cocks",
  "pussy", "pussies",
  "whore", "whores",
  "slut", "sluts",
  "nigger", "nigga", "niggas",
  "chink", "chinks",
  "kike", "kikes",
  "spic", "spics",
  "wetback", "wetbacks",

  // Hindi abusive words (transliterated)
  "madarchod", "maderchod",
  "behenchod", "behenchhod", "behen chod",
  "bhosdike", "bhosdika", "bhosdi",
  "chutiya", "chutiye", "chutia",
  "lund", "loda", "lode",
  "gandu", "gand",
  "randi", "rand", "randiya",
  "sala", "saala", "saale",
  "harami", "haramzada",
  "kamina", "kamine",
  "chakke", "chakka",
  "hijra", "hijre",

  // Variations and common misspellings / leet forms
  "f*ck", "f**k", "f***", "f****",
  "sh*t", "s**t", "s***",
  "b*tch", "b**ch", "b***h",
  "a**hole", "a**holes",
  "d*ck", "d**k",
  "p*ssy", "p**sy",
];

// Function to normalize text for better matching
const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // Convert to lowercase
  let normalized = text.toLowerCase();
  
  // Replace common leet speak characters
  normalized = normalized.replace(/@/g, 'a');
  normalized = normalized.replace(/3/g, 'e');
  normalized = normalized.replace(/0/g, 'o');
  normalized = normalized.replace(/1/g, 'i');
  normalized = normalized.replace(/!/g, 'i');
  normalized = normalized.replace(/5/g, 's');
  normalized = normalized.replace(/\$/g, 's');
  normalized = normalized.replace(/7/g, 't');
  
  // Remove special characters but keep spaces
  normalized = normalized.replace(/[^a-z0-9\s]/gi, '');
  
  return normalized;
};

// Function to check if text contains profanity
const containsProfanity = (text) => {
  if (!text || typeof text !== "string") return false;

  const lowerText = text.toLowerCase();
  const normalizedText = normalizeText(text);

  // Split into word tokens so we only match whole words,
  // not substrings inside normal words (e.g. "Ankit" vs "ki")
  const tokens = lowerText.split(/\s+/).filter(Boolean);
  const normalizedTokens = normalizedText.split(/\s+/).filter(Boolean);

  for (const word of PROFANE_WORDS) {
    const lowerWord = word.toLowerCase();
    const normalizedWord = normalizeText(word);

    if (tokens.includes(lowerWord)) {
      return true;
    }

    if (normalizedWord && normalizedTokens.includes(normalizedWord)) {
      return true;
    }
  }

  return false;
};

// Function to filter profanity from text (replace with asterisks)
const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let filteredText = text;
  const lowerText = text.toLowerCase();
  
  for (const word of PROFANE_WORDS) {
    const lowerWord = word.toLowerCase();
    const regex = new RegExp(lowerWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    
    if (lowerText.includes(lowerWord)) {
      filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    }
  }
  
  return filteredText;
};

// Middleware to validate request body for profanity
export const validateProfanity = (req, res, next) => {
  // Only check content fields, NOT credentials like email/password
  const fieldsToCheck = [
    'title',
    'description',
    'category',
    'name',
    'class',
    'text',
    'user',
    'comment',
  ];
  
  for (const field of fieldsToCheck) {
    const value = req.body?.[field];
    
    if (value && typeof value === 'string') {
      if (containsProfanity(value)) {
        return res.status(400).json({
          success: false,
          message: `Your ${field} contains inappropriate language. Please use respectful and appropriate language.`,
          field: field
        });
      }
    }
  }
  
  // Also check all string values in body recursively
  const checkObject = (obj) => {
    for (const key in obj) {
      // Skip credential / technical fields
      if (['email', 'password', 'token'].includes(key)) {
        // Do not apply profanity filter on these keys
        // eslint-disable-next-line no-continue
        continue;
      }

      if (typeof obj[key] === 'string' && containsProfanity(obj[key])) {
        return res.status(400).json({
          success: false,
          message: `Your input contains inappropriate language. Please use respectful and appropriate language.`,
          field: key
        });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        const result = checkObject(obj[key]);
        if (result) return result;
      }
    }
    return null;
  };
  
  if (req.body && typeof req.body === 'object') {
    const result = checkObject(req.body);
    if (result) return result;
  }
  
  next();
};

// Function to sanitize text (remove profanity)
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // First check if it contains profanity
  if (containsProfanity(text)) {
    // Replace with asterisks
    return filterProfanity(text);
  }
  
  return text;
};

// Export utility functions
export { containsProfanity, filterProfanity, normalizeText };

export default validateProfanity;
