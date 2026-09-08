// Helper utility for intelligent username extraction from emails
// Handles concatenated names like parvjain930 -> parv, randomlogin -> random,
// anilbadra123 -> anil, vikarantbansal1234 -> vikarant

export const COMMON_SUFFIXES = [
  // Surnames (ordered by length descending so longer ones match first)
  'chatterjee', 'mukherjee', 'srivastava', 'chaudhary', 'choudhary', 'shekhawat', 'tripathi', 'malhotra', 'kulkarni',
  'banerjee', 'bhadra', 'badra', 'bansal', 'singhal', 'bindal', 'jindal', 'mittal', 'shukla', 'saxena', 'pandey',
  'tiwari', 'chouhan', 'chauhan', 'agarwal', 'aggarwal', 'bhatia', 'deshmukh', 'gaikwad', 'solanki', 'rathore',
  'sharma', 'verma', 'gupta', 'patel', 'yadav', 'reddy', 'mishra', 'meena', 'mehta', 'rawat', 'joshi', 'dubey',
  'kumar', 'singh', 'naidu', 'thakur', 'rajput', 'pillai', 'iyengar', 'murthy', 'jadhav', 'khanna', 'oberoi',
  'dhawan', 'parmar', 'gehlot', 'tanwar', 'sisodia', 'kapoor', 'chopra', 'malik', 'dalal', 'patil', 'pawar',
  'shinde', 'sahni', 'kohli', 'bose', 'ghosh', 'dutta', 'khatri', 'nair', 'iyer', 'jain', 'shah', 'modi',
  'soni', 'dave', 'vyas', 'garg', 'goel', 'more', 'babu', 'sood', 'sethi', 'tomar', 'dey', 'das', 'sen', 'roy', 'rao',
  // Suffix words (login, user, account, etc.)
  'login', 'user', 'account', 'official', 'test', 'demo', 'dev', 'admin', 'work', 'real', 'mail', 'email', 'profile'
]

/**
 * Extracts the clean first name / username from an email address or input
 * Examples:
 *   parvjain930@gmail.com -> 'parv'
 *   randomlogin@gmail.com -> 'random'
 *   anilbadra123@gmail.com -> 'anil'
 *   vikarantbansal1234@gmail.com -> 'vikarant'
 *   john.doe@gmail.com -> 'john'
 */
export function extractCleanUsername(emailOrUsername) {
  if (!emailOrUsername) return 'user'

  // Extract prefix before @
  let raw = String(emailOrUsername).split('@')[0].trim().toLowerCase()

  // 1. If explicit separator exists (e.g. parv.jain or parv_930 or parv-bansal)
  if (/[._\-+]/.test(raw)) {
    const firstPart = raw.split(/[._\-+]/)[0].replace(/\d+$/, '')
    if (firstPart && firstPart.length >= 2) {
      return firstPart
    }
  }

  // 2. Strip trailing numbers (e.g. parvjain930 -> parvjain, anilbadra123 -> anilbadra)
  let cleaned = raw.replace(/\d+$/, '')

  // 3. Match and strip known surname or suffix words
  for (const suffix of COMMON_SUFFIXES) {
    if (cleaned.endsWith(suffix) && cleaned.length > suffix.length + 1) {
      cleaned = cleaned.slice(0, -suffix.length)
      break
    }
  }

  // 4. Strip any residual trailing symbols or numbers
  cleaned = cleaned.replace(/[\d._-]+$/, '')

  return cleaned || raw.replace(/\d+$/, '') || raw || 'user'
}

/**
 * Formats display name with capitalized first letter
 * Example: 'parv' -> 'Parv'
 */
export function formatDisplayName(username) {
  if (!username) return 'User'
  return username.charAt(0).toUpperCase() + username.slice(1)
}
