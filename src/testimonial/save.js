/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Icon, commentAuthorAvatar } from '@wordpress/icons';

const Save = ( { attributes } ) => {
	const { testimonials } = attributes;

	return (
		<>
			<div { ...useBlockProps.save() } className="gtb-testimonial">
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
		</>
	);
};

export default Save;
