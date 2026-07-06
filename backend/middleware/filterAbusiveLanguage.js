// Middleware to filter abusive language from review submissions

// Common abusive words list (you can expand this list)
// Note: Only include words that are clearly abusive, not common words that might be part of normal text
const abusiveWords = [
  // English abusive words (clearly offensive only)
  'fuck', 'fucking', 'fucked', 'fucker',
  'shit', 'shitting', 'shitted', 'shyt',
  'asshole', 'assholes', // Only "asshole", not "ass" alone (to avoid false positives like "class", "pass")
  'bitch', 'bitches',
  'bastard', 'bastards',
  'piss', 'pissing', 'pissed', // Only when used as curse
  'dick', 'dicks', // Only when used as curse
  'cock', 'cocks', // Only when used as curse
  'pussy', 'pussies',
  'whore', 'whores',
  'slut', 'sluts',
  'nigger', 'nigga', 'niggas',
  'chink', 'chinks',
  'kike', 'kikes',
  'spic', 'spics',
  'wetback', 'wetbacks',
  
  // Hindi abusive words (transliterated)
  'madarchod', 'maderchod',
  'behenchod', 'behenchhod', 'behen chod',
  'bhosdike', 'bhosdika', 'bhosdi',
  'chutiya', 'chutiye', 'chutia',
  'lund', 'loda', 'lode',
  'gandu', 'gand',
  'randi', 'rand', 'randiya',
  'sala', 'saala', 'saale',
  'harami', 'haramzada',
  'kamina', 'kamine',
  'chakke', 'chakka',
  'hijra', 'hijre',
  
  // Variations and common misspellings
  'f*ck', 'f**k', 'f***', 'f****',
  'sh*t', 's**t', 's***',
  'b*tch', 'b**ch', 'b***h',
  'a**hole', 'a**holes',
  'd*ck', 'd**k',
  'p*ssy', 'p**sy',
];

/**
 * Check if text contains abusive language
 * @param {string} text - Text to check
 * @returns {boolean} - True if abusive language found
 */
const containsAbusiveLanguage = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  const lowerText = text.toLowerCase().trim();
  
  // Split text into words (including punctuation handling)
  const words = lowerText.split(/\s+/);
  
  // Check for abusive words
  for (const abusiveWord of abusiveWords) {
    const escapedWord = abusiveWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Method 1: Check with word boundaries (most accurate)
    // This ensures we match whole words only, not substrings
    const wordBoundaryRegex = new RegExp(`\\b${escapedWord}\\b`, 'i');
    if (wordBoundaryRegex.test(lowerText)) {
      return true;
    }
    
    // Method 2: Check if word appears as a standalone word (handles punctuation)
    // This catches cases like "fuck!" or "shit." or "asshole?"
    const standaloneRegex = new RegExp(`(^|[^a-z0-9])${escapedWord}([^a-z0-9]|$)`, 'i');
    if (standaloneRegex.test(lowerText)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Middleware to filter abusive language from request body
 */
const filterAbusiveLanguage = (req, res, next) => {
  try {
    const { userName, message, course } = req.body;
    
    // Check userName
    if (userName && containsAbusiveLanguage(userName)) {
      return res.status(400).json({ 
        message: "Your feedback contains inappropriate language. Please use respectful and appropriate language." 
      });
    }
    
    // Check message/feedback
    if (message && containsAbusiveLanguage(message)) {
      return res.status(400).json({ 
        message: "Your feedback contains inappropriate language. Please use respectful and appropriate language." 
      });
    }
    
    // Check course (if provided)
    if (course && containsAbusiveLanguage(course)) {
      return res.status(400).json({ 
        message: "Your feedback contains inappropriate language. Please use respectful and appropriate language." 
      });
    }
    
    // If no abusive language found, proceed to next middleware
    next();
  } catch (error) {
    console.error("Error in filterAbusiveLanguage middleware:", error);
    return res.status(500).json({ 
      message: "Error validating content. Please try again." 
    });
  }
};

export default filterAbusiveLanguage;
