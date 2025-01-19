/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dateI18n, format } from '@wordpress/date';

/**
 * Internal dependencies
 */
import { trimExcerpt } from '../utils/excerpt';

/**
 * Post Card Component
 *
 * @param {Object} props            - Component properties
 * @param {Object} props.post       - Post object
 * @param {Object} props.attributes - Block attributes
 * @param {string} props.dateFormat - Date format
 * @return {JSX.Element}            - Post card
 */
const PostCard = ( { post, attributes, dateFormat } ) => {
	const { displayExcerpt, excerptLength, displayFeaturedImage } = attributes;

	return (
		<article className="gtb-posts-grid__item">
			{ displayFeaturedImage &&
				post._embedded?.[ 'wp:featuredmedia' ] && (
					<img
						className="gtb-posts-grid__image"
						src={
							post._embedded[ 'wp:featuredmedia' ][ 0 ].source_url
						}
						alt={ post.title.rendered }
					/>
				) }
			<div className="gtb-posts-grid__content">
				<h3 className="gtb-posts-grid__title">
					<a
						href={ post.link }
						dangerouslySetInnerHTML={ {
							__html: post.title.rendered,
						} }
					/>
				</h3>
				{ displayExcerpt && post.excerpt.rendered && (
					<div className="gtb-posts-grid__excerpt">
						<p>
							{ trimExcerpt(
								post.excerpt.rendered,
								excerptLength
							) }
						</p>
					</div>
				) }
				<div className="gtb-posts-grid__meta">
					{ post.date_gmt && (
						<time
							dateTime={ format( 'c', post.date_gmt ) }
							className="gtb-posts-grid__post-date"
						>
							{ dateI18n( dateFormat, post.date_gmt ) }
						</time>
					) }
					<a href={ post.link } className="gtb-posts-grid__read-more">
						{ __( 'Read More', 'gutenblocks' ) }
					</a>
				</div>
			</div>
		</article>
	);
};

export default PostCard;
