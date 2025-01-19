/**
 * Trims excerpt to specified length and adds ellipsis if needed.
 *
 * @param {string} excerptHtml - HTML content of the excerpt
 * @param {number} length      - Number of words to keep
 * @return {string}           - Trimmed excerpt
 */
export const trimExcerpt = ( excerptHtml, length ) => {
	// Create temporary element to parse HTML
	const tempElement = document.createElement( 'div' );
	tempElement.innerHTML = excerptHtml;

	// Get text content
	const text = tempElement.textContent || tempElement.innerText;

	// Split into words and get the specified number
	const words = text.split( /\s+/ );
	const trimmedWords = words.slice( 0, length );

	// Add ellipsis if we trimmed the content
	return words.length > length
		? `${ trimmedWords.join( ' ' ) }...`
		: trimmedWords.join( ' ' );
};
