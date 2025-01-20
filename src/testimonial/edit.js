/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	MediaUpload,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Icon,
	commentAuthorAvatar,
	chevronLeft,
	chevronRight,
} from '@wordpress/icons';
import {
	Button,
	PanelBody,
	RangeControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Quiz Block Edit Component
 *
 * @param {Object}   props               Component properties
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Block attributes update function
 * @return {JSX.Element}                Block edit component
 */
const Edit = ( { attributes, setAttributes } ) => {
	const { testimonials, slidePerView } = attributes;

	// Add state for current slide
	const [ currentIndex, setCurrentIndex ] = useState( 0 );
	const totalSlides = testimonials.length;

	// Calculate transform style
	const sliderStyle = {
		transform: `translateX(-${ currentIndex * ( 100 / slidePerView ) }%)`,
		transition: 'transform 0.5s ease-in-out',
	};

	// Next slide function
	const nextSlide = () => {
		const maxIndex = totalSlides - slidePerView;
		setCurrentIndex( ( currentIndex ) =>
			currentIndex >= maxIndex ? 0 : currentIndex + 1
		);
	};

	// Previous slide function
	const prevSlide = () => {
		const maxIndex = totalSlides - slidePerView;
		setCurrentIndex( ( currentIndex ) =>
			currentIndex <= 0 ? maxIndex : currentIndex - 1
		);
	};
	const addTestimonial = () => {
		const newTestimonial = {
			author: 'Sundar Pichai',
			designation: 'CEO, Alphabet Inc',
			reviewTitle: 'Great Service',
			reviewText:
				'I am very satisfied with the service. Highly recommended!',
			profileImage: null,
			rating: 5,
		};
		setAttributes( {
			testimonials: [ ...testimonials, newTestimonial ],
		} );
	};

	const removeTestimonial = ( indexToRemove ) => {
		const updatedTestimonials = testimonials.filter(
			( _, index ) => index !== indexToRemove
		);
		setAttributes( { testimonials: updatedTestimonials } );
	};

	const updateTestimonial = ( index, field, value ) => {
		const updatedTestimonials = testimonials.map( ( testimonial, i ) =>
			i === index ? { ...testimonial, [ field ]: value } : testimonial
		);
		setAttributes( { testimonials: updatedTestimonials } );
	};

	// Return if no testimonials
	if ( ! totalSlides ) {
		return (
			<div { ...useBlockProps() } style={{ textAlign: 'center'}}>
				<Button variant="primary" onClick={ addTestimonial }>
					{ __( 'Add Testimonial', 'gutenblocks' ) }
				</Button>
			</div>
		);
	}

	return (
		<div
			{ ...useBlockProps() }
			style={ { '--items-per-view': slidePerView } }
		>
			<InspectorControls>
				<PanelBody
					title={ __( 'Testimonials Content', 'gutenblocks' ) }
				>
					{ testimonials.map( ( testimonial, index ) => (
						<PanelBody
							key={ index }
							title={ `Testimonial ${ index + 1 }` }
							initialOpen={ false }
						>
							<MediaUpload
								label={ __( 'Profile Image', 'gutenblocks' ) }
								style={ { marginBottom: '20px' } }
								onSelect={ ( media ) =>
									updateTestimonial(
										index,
										'profileImage',
										media.url
									)
								}
								allowedTypes={ [ 'image' ] }
								value={ testimonial.profileImage }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										variant="secondary"
										className="profile-image-upload"
									>
										{ testimonial.profileImage
											? __(
													'Change Profile Image',
													'gutenblock'
											  )
											: __(
													'Upload Profile Image',
													'gutenblock'
											  ) }
									</Button>
								) }
							/>
							<TextControl
								label="Author"
								value={ testimonial.author }
								onChange={ ( value ) =>
									updateTestimonial( index, 'author', value )
								}
								__nextHasNoMarginBottom={ true }
							/>
							<TextControl
								label="Designation"
								value={ testimonial.designation }
								onChange={ ( value ) =>
									updateTestimonial(
										index,
										'designation',
										value
									)
								}
								__nextHasNoMarginBottom={ true }
							/>
							<TextControl
								label="Review Title"
								value={ testimonial.reviewTitle }
								onChange={ ( value ) =>
									updateTestimonial(
										index,
										'reviewTitle',
										value
									)
								}
								__nextHasNoMarginBottom={ true }
							/>
							<TextareaControl
								label="Review Text"
								value={ testimonial.reviewText }
								onChange={ ( value ) =>
									updateTestimonial(
										index,
										'reviewText',
										value
									)
								}
								__nextHasNoMarginBottom={ true }
							/>
							<RangeControl
								label={ __( 'Rating', 'gutenblocks' ) }
								value={ testimonial.rating }
								onChange={ ( value ) =>
									updateTestimonial( index, 'rating', value )
								}
								min={ 1 }
								max={ 5 }
							/>
							<Button
								variant="secondary"
								isDestructive={ true }
								onClick={ () => removeTestimonial( index ) }
							>
								{ __( 'Remove Testimonial', 'gutenblocks' ) }
							</Button>
						</PanelBody>
					) ) }
					<Button variant="primary" onClick={ addTestimonial }>
						{ __( 'Add Testimonial', 'gutenblocks' ) }
					</Button>
				</PanelBody>

				<PanelBody
					title={ __( 'Slider Settings', 'gutenblocks' ) }
					initialOpen={ false }
					className="testimonials-settings"
				>
					<RangeControl
						label={ __( 'Slide Per Voew', 'gutenblocks' ) }
						value={ slidePerView }
						onChange={ ( value ) =>
							setAttributes( { slidePerView: value } )
						}
						min={ 1 }
						max={ 6 }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="gtb-testimonial__navigation">
				<button
					onClick={ prevSlide }
					aria-label="<?php echo esc_attr( 'Previous Slide', 'gutenblocks' ); ?>"
					className="gtb-testimonial__navigation--prev"
				>
					<Icon icon={ chevronLeft } size={ 24 } />
				</button>

				<button
					onClick={ nextSlide }
					aria-label="<?php echo esc_attr( 'Next Slide', 'gutenblocks' ); ?>"
					className="gtb-testimonial__navigation--next"
				>
					<Icon icon={ chevronRight } size={ 24 } />
				</button>
			</div>
			<div className="gtb-testimonial">
				<div className="gtb-testimonial__slider" style={ sliderStyle }>
					{ testimonials.map( ( testimonial, index ) => (
						<div className="gtb-testimonial__slide" key={ index }>
							<div className="gtb-testimonial__content">
								<div className="profile-image-container">
									{ testimonial.profileImage ? (
										<img
											src={ testimonial.profileImage }
											alt="Profile"
											className="gtb-testimonial__profile-image"
										/>
									) : (
										<div className="gtb-testimonial__button-large">
											<Icon
												icon={ commentAuthorAvatar }
												size={ 120 }
											/>
										</div>
									) }
								</div>
								<div className="gtb-testimonial__header">
									<h3 className="gtb-testimonial__author-name">
										{ testimonial.author }
									</h3>
									<p className="gtb-testimonial__designation">
										{ testimonial.designation }
									</p>
								</div>
								<h4 className="gtb-testimonial__review-title">
									{ testimonial.reviewTitle }
								</h4>
								<div 
									className="gtb-testimonial__rating-stars" 
									style={{ '--gtb-rating': Math.abs(parseInt(testimonial.rating, 10)) }}>
								</div>
								<p className="gtb-testimonial__review-text">
									{ testimonial.reviewText }
								</p>
							</div>
						</div>
					) ) }
				</div>
			</div>
		</div>
	);
};

export default Edit;
