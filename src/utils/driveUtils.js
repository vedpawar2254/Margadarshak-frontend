/**
 * Google Drive Link Validation Utilities
 * Validates Drive links and extracts file type information
 */

// Valid Google Drive URL patterns
const DRIVE_PATTERNS = [
    // Direct file links: drive.google.com/file/d/{fileId}
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    // Open links: drive.google.com/open?id={fileId}
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    // Google Docs
    /docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/,
    // Google Slides (Presentations)
    /docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/,
    // Google Sheets
    /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
    // Preview links
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/preview/,
    // View links
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/,
];

/**
 * Validate a Google Drive link
 * @param {string} url - The URL to validate
 * @returns {Object} - { isValid, errors, fileId, fileType, embedUrl }
 */
export const validateDriveLink = (url) => {
    const result = {
        isValid: false,
        errors: [],
        fileId: null,
        fileType: null,
        embedUrl: null
    };

    if (!url || typeof url !== 'string') {
        result.errors.push('URL is required');
        return result;
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
        result.errors.push('URL cannot be empty');
        return result;
    }

    // Check if it's a URL
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        result.errors.push('URL must start with http:// or https://');
        return result;
    }

    // Check if it's a Google Drive/Docs URL
    const isGoogleUrl = trimmedUrl.includes('drive.google.com') || trimmedUrl.includes('docs.google.com');

    if (!isGoogleUrl) {
        // Not a Drive link - might be YouTube, Vimeo, or direct video URL
        // This is valid for video URLs
        result.isValid = true;
        result.fileType = detectNonDriveFileType(trimmedUrl);
        result.embedUrl = trimmedUrl;
        return result;
    }

    // Try to match against Drive patterns
    let matched = false;
    for (const pattern of DRIVE_PATTERNS) {
        const match = trimmedUrl.match(pattern);
        if (match) {
            result.fileId = match[1];
            matched = true;
            break;
        }
    }

    if (!matched) {
        result.errors.push('Invalid Google Drive URL format. Use a direct share link.');
        return result;
    }

    // Detect file type from URL
    result.fileType = detectDriveFileType(trimmedUrl);

    // Generate embed URL
    result.embedUrl = generateEmbedUrl(trimmedUrl, result.fileId, result.fileType);

    result.isValid = true;
    return result;
};

/**
 * Detect file type from Google Drive/Docs URL
 * @param {string} url - The URL
 * @returns {string} - 'video' | 'ppt' | 'doc' | 'sheet' | 'pdf' | 'unknown'
 */
export const detectDriveFileType = (url) => {
    if (url.includes('docs.google.com/presentation')) {
        return 'ppt';
    }
    if (url.includes('docs.google.com/document')) {
        return 'doc';
    }
    if (url.includes('docs.google.com/spreadsheets')) {
        return 'sheet';
    }
    // For generic Drive file links, default to video
    // Admin should use Google Docs/Slides for documents
    if (url.includes('drive.google.com/file')) {
        return 'video';
    }
    return 'unknown';
};

/**
 * Detect file type from non-Drive URLs
 * @param {string} url - The URL
 * @returns {string} - 'video' | 'pdf' | 'unknown'
 */
export const detectNonDriveFileType = (url) => {
    const lowerUrl = url.toLowerCase();

    // Video platforms
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
        return 'video';
    }
    if (lowerUrl.includes('vimeo.com')) {
        return 'video';
    }

    // File extensions
    if (lowerUrl.endsWith('.pdf')) {
        return 'pdf';
    }
    if (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.mov')) {
        return 'video';
    }
    if (lowerUrl.endsWith('.ppt') || lowerUrl.endsWith('.pptx')) {
        return 'ppt';
    }
    if (lowerUrl.endsWith('.doc') || lowerUrl.endsWith('.docx')) {
        return 'doc';
    }

    return 'video'; // Default to video for unknown URLs
};

/**
 * Generate embeddable URL for different content types
 * @param {string} originalUrl - Original URL
 * @param {string} fileId - Extracted file ID
 * @param {string} fileType - Detected file type
 * @returns {string} - Embeddable URL
 */
export const generateEmbedUrl = (originalUrl, fileId, fileType) => {
    if (!fileId) return originalUrl;

    switch (fileType) {
        case 'ppt':
            return `https://docs.google.com/presentation/d/${fileId}/embed`;
        case 'doc':
            return `https://docs.google.com/document/d/${fileId}/preview`;
        case 'sheet':
            return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
        case 'video':
            // For Drive videos, use preview URL
            return `https://drive.google.com/file/d/${fileId}/preview`;
        default:
            return originalUrl;
    }
};

/**
 * Convert a Drive sharing link to an embeddable format
 * @param {string} url - Original Drive URL
 * @returns {string} - Embed-ready URL
 */
export const toEmbedUrl = (url) => {
    const validation = validateDriveLink(url);
    return validation.embedUrl || url;
};

/**
 * Check if a URL is likely publicly accessible
 * Note: This is a heuristic check, not a guarantee
 * @param {string} url - URL to check
 * @returns {Object} - { isPublic, warnings }
 */
export const checkPublicAccess = (url) => {
    const warnings = [];

    // Check for common private link patterns
    if (url.includes('/d/') && !url.includes('sharing')) {
        warnings.push('This link may be private. Ensure sharing is set to "Anyone with the link".');
    }

    // Check for authentication parameters
    if (url.includes('authuser=') || url.includes('usp=sharing')) {
        // These are usually fine
    }

    return {
        isPublic: warnings.length === 0,
        warnings
    };
};
