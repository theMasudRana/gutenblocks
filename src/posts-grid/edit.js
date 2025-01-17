/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Interface for component props
 *
 * @typedef  {Object}   EditProps
 * @property {Object}   attributes               - Block attributes object
 * @property {number}   attributes.numberOfPosts - Number of posts to display
 * @property {number}   attributes.columns       - Number of grid columns
 * @property {Function} setAttributes            - Function to update block attributes
 */

/**
 * Posts Grid Block Edit Component
 *
 * @param   {EditProps}    props - Component properties
 * @return  {JSX.Element}        - Component JSX
 */

const Edit = ( { attributes, setAttributes } ) => {
	const { numberOfPosts, columns } = attributes;

	// Fetch posts using WordPress data layer
	const { posts, isLoading, hasFinished } = useSelect(
		( select ) => {
			const { getEntityRecords, isResolving, hasFinishedResolution } =
				select( 'core' );
			const query = {
				per_page: numberOfPosts,
				_embed: true,
			};

			return {
				posts: getEntityRecords( 'postType', 'post', query ),
				isLoading: isResolving( 'core', 'getEntityRecords', [
					'postType',
					'post',
					query,
				] ),
				hasFinished: hasFinishedResolution(
					'core',
					'getEntityRecords',
					[ 'postType', 'post', query ]
				),
			};
		},
		[ numberOfPosts ]
	);

	const blockProps = useBlockProps( {
		className: `posts-grid columns-${ columns }`,
	} );

	// Handle loading state
	if ( isLoading ) {
		return <Spinner />;
	}

	// Handle error state
	if ( ! isLoading && ! posts && hasFinished ) {
		return <div { ...blockProps }>Error: Failed to load posts</div>;
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Grid Settings', 'gutenblocks' ) }>
					<RangeControl
						label={ __( 'Number of posts', 'gutenblocks' ) }
						value={ numberOfPosts }
						onChange={ ( value ) =>
							setAttributes( { numberOfPosts: value } )
						}
						min={ 1 }
						max={ 12 }
					/>
					<RangeControl
						label={ __( 'Columns', 'gutenblocks' ) }
						value={ columns }
						onChange={ ( value ) =>
							setAttributes( { columns: value } )
						}
						min={ 1 }
						max={ 4 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ posts?.map( ( post ) => (
					<article key={ post.id } className="posts-grid__item">
						{ post._embedded?.[ 'wp:featuredmedia' ] && (
							<img
								className="posts-grid__image"
								src={
									post._embedded[ 'wp:featuredmedia' ][ 0 ]
										.source_url
								}
								alt={ post.title.rendered }
							/>
						) }
						<h3
							className="posts-grid__title"
							dangerouslySetInnerHTML={ {
								__html: post.title.rendered,
							} }
						/>
						<div
							className="posts-grid__excerpt"
							dangerouslySetInnerHTML={ {
								__html: post.excerpt.rendered,
							} }
						/>
						<a href={ post.link } className="posts-grid__read-more">
							{ __( 'Read More', 'gutenblocks' ) }
						</a>
					</article>
				) ) }
			</div>
		</>
	);
};

export default Edit;
