/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	MediaUpload,
	useBlockProps,
} from '@wordpress/block-editor';
import { Icon, commentAuthorAvatar } from '@wordpress/icons';
import {
	Button,
	PanelBody,
	RangeControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

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

	const addTestimonial = () => {
		const newTestimonial = {
			author: 'John Doe',
			designation: 'CEO, Example Corp',
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

	return (
		<div { ...useBlockProps() }>
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

			<div className="gtb-testimonial">
				<div className="gtb-testimonial__slider">
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
										{ testimonial.author || 'Author Name' }
									</h3>
									<p className="gtb-testimonial__designation">
										{ testimonial.designation ||
											'Designation' }
									</p>
								</div>
								<h4 className="gtb-testimonial__review-title">
									{ testimonial.reviewTitle ||
										'Review Title' }
								</h4>
								<div className="gtb-testimonial__rating-stars">
									{ [ ...Array( 5 ) ].map(
										( _, starIndex ) => (
											<span
												key={ starIndex }
												className={ `star ${
													starIndex <
													testimonial.rating
														? 'active'
														: ''
												}` }
											>
												★
											</span>
										)
									) }
								</div>
								<p className="gtb-testimonial__review-text">
									{ testimonial.reviewText ||
										__( 'Review Text', 'gutenblocks' ) }
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
