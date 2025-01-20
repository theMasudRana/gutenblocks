// WordPress dependencies
import {
	Button,
	PanelBody,
	RangeControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { MediaUpload, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Controls component.
 *
 * @param {Object}   props                      Component properties.
 * @param {Array}    props.testimonials         Array of testimonial objects.
 * @param {number}   props.slidePerView         Number of slides per view.
 * @param {Function} props.onAddTestimonial     Add testimonial handler.
 * @param {Function} props.onRemoveTestimonial  Remove testimonial handler.
 * @param {Function} props.onUpdateTestimonial  Update testimonial handler.
 * @param {Function} props.onUpdateSlidePerView Update slide per view handler.
 *
 * @return {JSX.Element} Controls component.
 */
const Controls = ( {
	testimonials,
	slidePerView,
	onAddTestimonial,
	onRemoveTestimonial,
	onUpdateTestimonial,
	onUpdateSlidePerView,
} ) => (
	<InspectorControls>
		<PanelBody title={ __( 'Testimonials Content', 'gutenblocks' ) }>
			{ testimonials.map( ( testimonial, index ) => (
				<PanelBody
					key={ index }
					title={ `Testimonial ${ index + 1 }` }
					initialOpen={ false }
				>
					<MediaUpload
						label={ __( 'Profile Image', 'gutenblocks' ) }
						onSelect={ ( media ) =>
							onUpdateTestimonial(
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
									? __( 'Change Profile Image', 'gutenblock' )
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
							onUpdateTestimonial( index, 'author', value )
						}
						__nextHasNoMarginBottom={ true }
					/>
					<TextControl
						label="Designation"
						value={ testimonial.designation }
						onChange={ ( value ) =>
							onUpdateTestimonial( index, 'designation', value )
						}
						__nextHasNoMarginBottom={ true }
					/>
					<TextControl
						label="Review Title"
						value={ testimonial.reviewTitle }
						onChange={ ( value ) =>
							onUpdateTestimonial( index, 'reviewTitle', value )
						}
						__nextHasNoMarginBottom={ true }
					/>
					<TextareaControl
						label="Review Text"
						value={ testimonial.reviewText }
						onChange={ ( value ) =>
							onUpdateTestimonial( index, 'reviewText', value )
						}
						__nextHasNoMarginBottom={ true }
					/>
					<RangeControl
						label={ __( 'Rating', 'gutenblocks' ) }
						value={ testimonial.rating }
						onChange={ ( value ) =>
							onUpdateTestimonial( index, 'rating', value )
						}
						min={ 1 }
						max={ 5 }
					/>
					<Button
						variant="secondary"
						isDestructive={ true }
						onClick={ () => onRemoveTestimonial( index ) }
					>
						{ __( 'Remove Testimonial', 'gutenblocks' ) }
					</Button>
				</PanelBody>
			) ) }
			<Button variant="primary" onClick={ onAddTestimonial }>
				{ __( 'Add Testimonial', 'gutenblocks' ) }
			</Button>
		</PanelBody>
		<PanelBody
			title={ __( 'Slider Settings', 'gutenblocks' ) }
			initialOpen={ false }
			className="testimonials-settings"
		>
			<RangeControl
				label={ __( 'Slide Per View', 'gutenblocks' ) }
				value={ slidePerView }
				onChange={ onUpdateSlidePerView }
				min={ 1 }
				max={ 6 }
			/>
		</PanelBody>
	</InspectorControls>
);

export default Controls;
