import candidates from '../data/candidates.json';

/**
 * Find matching candidates for a job listing
 * Checks job's "yrke" and "utbildning" fields against candidate keywords
 * Case-insensitive, partial matching
 * 
 * @param {Object} job - The job listing object
 * @returns {string[]} Array of matching Ärendenummer
 */
export function findMatchingCandidates(job) {
  const matches = new Set();
  
  // Combine yrke and utbildning fields for matching
  const jobText = [
    job.yrke || '',
    job.utbildning || ''
  ].join(' ').toLowerCase();
  
  // Skip if no text to match against
  if (!jobText.trim()) return [];
  
  // Check each candidate
  candidates.candidates.forEach(candidate => {
    // Check each of the candidate's yrke keywords
    for (const keyword of candidate.yrken) {
      const keywordLower = keyword.toLowerCase();
      
      // Partial match: check if keyword appears in job text OR job text contains keyword
      // This handles both directions:
      // - "admin" (keyword) matches "administratör" (job)
      // - "systemadministratör" (job) matches "admin" (keyword)
      if (jobText.includes(keywordLower) || keywordLower.includes(jobText.split(' ').find(word => word.length > 2 && keywordLower.includes(word)))) {
        matches.add(candidate.arendeNummer);
        break; // Found a match, no need to check more keywords for this candidate
      }
    }
  });
  
  return Array.from(matches);
}

/**
 * More thorough matching - checks each word in job fields against candidate keywords
 * @param {Object} job - The job listing object
 * @returns {string[]} Array of matching Ärendenummer
 */
export function findMatchingCandidatesDetailed(job) {
  const matches = new Set();
  
  // Get words from yrke and utbildning fields
  const jobWords = [
    job.yrke || '',
    job.utbildning || ''
  ]
    .join(' ')
    .toLowerCase()
    .split(/[\s,;.]+/) // Split on whitespace, commas, semicolons, periods
    .filter(word => word.length >= 2); // Only words with 2+ chars
  
  // Skip if no words to match
  if (jobWords.length === 0) return [];
  
  // Check each candidate
  candidates.candidates.forEach(candidate => {
    for (const keyword of candidate.yrken) {
      const keywordLower = keyword.toLowerCase();
      
      for (const jobWord of jobWords) {
        // Partial match in either direction
        if (keywordLower.includes(jobWord) || jobWord.includes(keywordLower)) {
          matches.add(candidate.arendeNummer);
          break;
        }
      }
      
      // If we already matched this candidate, move to next
      if (matches.has(candidate.arendeNummer)) break;
    }
  });
  
  return Array.from(matches);
}

export default findMatchingCandidatesDetailed;
