// ============================================
// BANASTHALI CAMPUS BOT - FUZZY MATCHING UTILITIES
// Intelligent matching with spelling tolerance
// ============================================

/**
 * Calculate Levenshtein distance between two strings
 * (measures how many edits needed to transform one string into another)
 */
export const levenshteinDistance = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
};

/**
 * Calculate similarity score between two strings (0-1)
 */
export const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};

/**
 * Normalize text for better matching
 */
export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize spaces
};

/**
 * Check if query contains any keyword with fuzzy matching
 */
export const fuzzyMatchKeywords = (query, keywords) => {
  const normalizedQuery = normalizeText(query);
  const queryWords = normalizedQuery.split(' ');

  let maxScore = 0;

  keywords.forEach((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    const keywordWords = normalizedKeyword.split(' ');

    // Direct substring match (highest priority)
    if (normalizedQuery.includes(normalizedKeyword)) {
      maxScore = Math.max(maxScore, 1.0);
      return;
    }

    // Word-by-word matching
    queryWords.forEach((qWord) => {
      keywordWords.forEach((kWord) => {
        // Exact word match
        if (qWord === kWord) {
          maxScore = Math.max(maxScore, 0.95);
          return;
        }

        // Partial match (one word contains another)
        if (qWord.includes(kWord) || kWord.includes(qWord)) {
          maxScore = Math.max(maxScore, 0.85);
          return;
        }

        // Fuzzy similarity match
        const similarity = calculateSimilarity(qWord, kWord);
        if (similarity > 0.75) {
          // 75% similarity threshold
          maxScore = Math.max(maxScore, similarity * 0.8);
        }
      });
    });

    // Full phrase similarity
    const phraseSimilarity = calculateSimilarity(normalizedQuery, normalizedKeyword);
    if (phraseSimilarity > 0.7) {
      maxScore = Math.max(maxScore, phraseSimilarity * 0.7);
    }
  });

  return maxScore;
};

/**
 * Find best matching answer from knowledge base
 */
export const findBestMatch = (userQuery, knowledgeBase) => {
  if (!userQuery || userQuery.trim().length === 0) {
    return null;
  }

  let bestMatch = null;
  let bestScore = 0;
  const CONFIDENCE_THRESHOLD = 0.4; // Minimum confidence to return a match

  knowledgeBase.forEach((entry) => {
    const score = fuzzyMatchKeywords(userQuery, entry.keywords);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  });

  // Only return if confidence is above threshold
  if (bestScore >= CONFIDENCE_THRESHOLD) {
    return {
      answer: bestMatch.answer,
      confidence: bestScore,
      matchedQuestion: bestMatch.question,
    };
  }

  return null;
};

/**
 * Get fallback message when no match is found
 */
export const getFallbackMessage = () => {
  const fallbacks = [
    "Sorry, I'm not trained on that topic yet. Please try asking about courses, hostel, placements, faculty, or campus facilities!",
    "I don't have information about that right now. You can ask me about admissions, fees, sports, cultural activities, or academic programs.",
    "I'm not sure about that. Try asking about the campus, hostels, mess timings, or any specific department!",
    "I couldn't find an answer to that. Feel free to ask about Banasthali's unique features, Panchmukhi Shiksha, or student life!",
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

/**
 * Format bot response
 */
export const formatBotResponse = (response) => {
  if (!response) return getFallbackMessage();

  // You can add additional formatting logic here
  return response.answer;
};

/**
 * Remove duplicate questions from knowledge base
 */
export const removeDuplicateQuestions = (knowledgeBase) => {
  const seen = new Set();
  return knowledgeBase.filter((entry) => {
    const normalized = normalizeText(entry.question);
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
};

/**
 * Validate and clean knowledge base
 */
export const validateKnowledgeBase = (knowledgeBase) => {
  return knowledgeBase.filter((entry) => {
    return (
      entry.keywords &&
      Array.isArray(entry.keywords) &&
      entry.keywords.length > 0 &&
      entry.question &&
      entry.answer
    );
  });
};
