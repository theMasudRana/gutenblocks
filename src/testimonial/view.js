/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

/**
 * Testimonials slider store configuration.
 */
store( 'gutenblocks/testimonials', {
	actions: {
		nextSlide: () => {
			const context = getContext();
			const { totalSlides, itemsPerView } = context;

			// Calculate new index, ensuring we don't exceed total slides
			const maxIndex = Math.max( 0, totalSlides - itemsPerView );
			context.currentIndex = Math.min(
				maxIndex,
				context.currentIndex + itemsPerView
			);

			// Update transform
			context.transform = getTransformValue(
				context.currentIndex,
				itemsPerView
			);
		},

		previousSlide: () => {
			const context = getContext();
			const { itemsPerView } = context;

			// Calculate new index, ensuring we don't go below 0
			context.currentIndex = Math.max(
				0,
				context.currentIndex - itemsPerView
			);

			// Update transform
			context.transform = getTransformValue(
				context.currentIndex,
				itemsPerView
			);
		},
	},
} );

/**
 * Calculates the transform value for the slider.
 *
 * @param {number} currentIndex - The current slide index.
 * @param {number} itemsPerView - Number of items visible per view.
 *
 * @return {string} The CSS transform value.
 */
function getTransformValue( currentIndex, itemsPerView ) {
	const offset = -currentIndex * ( 100 / itemsPerView );
	return `translateX(${ offset }%)`;
}
