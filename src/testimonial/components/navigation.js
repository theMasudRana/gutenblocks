// WordPress dependencies
import { Icon, chevronLeft, chevronRight } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Navigation component.
 *
 * @param {Object}   props        Component properties.
 * @param {Function} props.onPrev Previous slide handler.
 * @param {Function} props.onNext Next slide handler.
 *
 * @return {JSX.Element} Navigation component.
 */
const Navigation = ( { onPrev, onNext } ) => (
	<div className="gtb-testimonial__navigation">
		<button
			onClick={ onPrev }
			aria-label={ __( 'Previous Slide', 'gutenblocks' ) }
			className="gtb-testimonial__navigation--prev"
		>
			<Icon icon={ chevronLeft } size={ 24 } />
		</button>
		<button
			onClick={ onNext }
			aria-label={ __( 'Next Slide', 'gutenblocks' ) }
			className="gtb-testimonial__navigation--next"
		>
			<Icon icon={ chevronRight } size={ 24 } />
		</button>
	</div>
);

export default Navigation;
