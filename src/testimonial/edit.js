// Wordress dependencies
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

// Internal dependencies
import useSlider from './components/slider';
import Slide from './components/slide';
import Navigation from './components/navigation';
import Controls from './components/controls';

/**
 * Edit component.
 *
 * @param {Object} props            - Component properties.
 * @param {Object} props.attributes - Block attributes.
 *
 * @return {JSX.Element}               Block edit component.
 */

const Edit = ( { attributes, setAttributes } ) => {
	const { testimonials, slidePerView } = attributes;
	const blockProps = useBlockProps();

	const { nextSlide, prevSlide, sliderStyle } = useSlider(
		testimonials.length,
		slidePerView
	);

	const handleAddTestimonial = () => {
		const newTestimonial = {
			author: 'Author Name',
			designation: 'Designation',
			reviewTitle: 'Review Title',
			reviewText: 'Review text',
			profileImage: null,
			rating: 5,
		};
		setAttributes( {
			testimonials: [ ...testimonials, newTestimonial ],
		} );
	};

	const handleRemoveTestimonial = ( indexToRemove ) => {
		const updatedTestimonials = testimonials.filter(
			( _, index ) => index !== indexToRemove
		);
		setAttributes( { testimonials: updatedTestimonials } );
	};

	const handleUpdateTestimonial = ( index, field, value ) => {
		const updatedTestimonials = testimonials.map( ( testimonial, i ) =>
			i === index ? { ...testimonial, [ field ]: value } : testimonial
		);
		setAttributes( { testimonials: updatedTestimonials } );
	};

	// Add testimonial button if no testimonials
	if ( ! testimonials.length ) {
		return (
			<div { ...blockProps } style={ { textAlign: 'center' } }>
				<Button variant="primary" onClick={ handleAddTestimonial }>
					{ __( 'Add Testimonial', 'gutenblocks' ) }
				</Button>
			</div>
		);
	}

	return (
		<div { ...blockProps } style={ { '--items-per-view': slidePerView } }>
			<Controls
				testimonials={ testimonials }
				slidePerView={ slidePerView }
				onAddTestimonial={ handleAddTestimonial }
				onRemoveTestimonial={ handleRemoveTestimonial }
				onUpdateTestimonial={ handleUpdateTestimonial }
				onUpdateSlidePerView={ ( value ) =>
					setAttributes( { slidePerView: value } )
				}
			/>
			<Navigation onPrev={ prevSlide } onNext={ nextSlide } />
			<div className="gtb-testimonial">
				<div className="gtb-testimonial__slider" style={ sliderStyle }>
					{ testimonials.map( ( testimonial, index ) => (
						<Slide key={ index } testimonial={ testimonial } />
					) ) }
				</div>
			</div>
		</div>
	);
};

export default Edit;
