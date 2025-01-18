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
import {
	PanelBody,
	RangeControl,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { useSelect, dateI18n, format, getSettings} from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { useMemo } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Posts Grid Block Edit Component
 *
 * @param   {EditProps}    props - Component properties
 * @return  {JSX.Element}        - Component JSX
 */

const Edit = ( { attributes, setAttributes } ) => {
	const {
		numberOfPosts,
		columns,
		displayExcerpt,
		excerptLength,
		displayAuthor,
		displayPostDate,
		displayFeaturedImage,
	} = attributes;

	const query = useMemo(
		() => ( { per_page: numberOfPosts, _embed: true } ),
		[ numberOfPosts, displayFeaturedImage ]
	);

	const { posts, hasResolved } = useSelect(
		( select ) => {
			const selectorArgs = [ 'postType', 'post', query ];

			return {
				posts: select( coreDataStore ).getEntityRecords(
					...selectorArgs
				),
				hasResolved: select( coreDataStore ).hasFinishedResolution(
					'getEntityRecords',
					selectorArgs
				),
			};
		},
		[ query ]
	);

	// Get categories list
	const getCategoriesList = useSelect((select) =>
		select(coreDataStore).getEntityRecords("taxonomy", "category", {
			per_page: -1,
			status: "publish",
			context: "view",
		}),
	);

	const { categoryName, categoryLink} = useMemo(() => {
		const categoryName = new Map(
			getCategoriesList?.map((cat) => [cat.id, cat?.name]),
		);
		const categoryLink = new Map(
			getCategoriesList?.map((cat) => [cat.id, cat.link]),
		);
		return { categoryName, categoryLink}
	}, [getCategoriesList]);

	// Update block classes
	const blockProps = useBlockProps( {
		className: `gtb-posts-grid gtb-posts-grid--columns-${ columns }`,
	} );

	// Has not resolved yet
	if ( ! hasResolved ) {
		return (
			<div { ...blockProps }>
				<Spinner className="gtb-posts-grid__spinner" />
			</div>
		);
	}

	// Has resolved but no posts found
	if ( ! posts?.length && hasResolved ) {
		return (
			<div { ...blockProps }>
				{ __( 'No posts found.', 'gutenblocks' ) }
			</div>
		);
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
					<ToggleControl
						label={ __( 'Display featured image', 'gutenblocks' ) }
						checked={ displayFeaturedImage }
						onChange={ ( value ) =>
							setAttributes( { displayFeaturedImage: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ posts?.map( ( post ) => (
					<article key={ post.id } className="gtb-posts-grid__item">
						{ displayFeaturedImage &&
							post._embedded?.[ 'wp:featuredmedia' ] && (
								<img
									className="gtb-posts-grid__image"
									src={
										post._embedded[
											'wp:featuredmedia'
										][ 0 ].source_url
									}
									alt={ post.title.rendered }
								/>
							) }
						<div className="gtb-posts-grid__content">
							<div className="gtb-posts-grid__meta">
								{ post.date_gmt && (
									<time
										className="gtb-posts-grid__post-date"
									>
										{post.date_gmt}
									</time>
								) }
							</div>
							<h3
								className="gtb-posts-grid__title"
								dangerouslySetInnerHTML={ {
									__html: post.title.rendered,
								} }
							/>
							<div
								className="gtb-posts-grid__excerpt"
								dangerouslySetInnerHTML={ {
									__html: post.excerpt.rendered,
								} }
							/>
							<ul className="category-info">
								{post.categories &&
									post.categories.map((category, index) => (
										<li key={index} className="post-category">
											<a
												href={categoryLink.get(category)}
											>
												{categoryName.get(category)}
											</a>
										</li>
									))}
							</ul>
							<a
								href={ post.link }
								className="gtb-posts-grid__read-more"
							>
								{ __( 'Read More', 'gutenblocks' ) }
							</a>
						</div>
					</article>
				) ) }
			</div>
		</>
	);
};

export default Edit;
