// WordPress dependencies
import { useState } from '@wordpress/element';

/**
 * useSlider hook.
 *
 * @param {number} totalSlides  - Total number of slides.
 * @param {number} slidePerView - Number of slides per view.
 *
 * @return {Object} Slider object.
 */
const useSlider = ( totalSlides, slidePerView ) => {
	const [ currentIndex, setCurrentIndex ] = useState( 0 );

	const nextSlide = () => {
		const maxIndex = totalSlides - slidePerView;
		setCurrentIndex( ( prevIndex ) =>
			prevIndex >= maxIndex ? 0 : prevIndex + 1
		);
	};

	const prevSlide = () => {
		const maxIndex = totalSlides - slidePerView;
		setCurrentIndex( ( prevIndex ) =>
			prevIndex <= 0 ? maxIndex : prevIndex - 1
		);
	};

	const sliderStyle = {
		transform: `translateX(-${ currentIndex * ( 100 / slidePerView ) }%)`,
		transition: 'transform 0.5s ease-in-out',
	};

	return {
		currentIndex,
		nextSlide,
		prevSlide,
		sliderStyle,
	};
};

export default useSlider;
