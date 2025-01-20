// WordPress dependencies
import { Icon, commentAuthorAvatar } from '@wordpress/icons';

/**
 * Slide component.
 *
 * @param { Object } testimonial - Testimonial object.
 *
 * @return { JSX.Element } Slide component.
 */
const Slide = ( { testimonial } ) => (
	<div className="gtb-testimonial__slide">
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
						<Icon icon={ commentAuthorAvatar } size={ 120 } />
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
				style={ {
					'--gtb-rating': Math.abs(
						parseInt( testimonial.rating, 10 )
					),
				} }
			/>
			<p className="gtb-testimonial__review-text">
				{ testimonial.reviewText }
			</p>
		</div>
	</div>
);

export default Slide;
