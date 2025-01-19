/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { useMemo } from '@wordpress/element';
import { getSettings } from '@wordpress/date';

/**
 * Internal dependencies
 */
import './editor.scss';
import PostsGridInspector from './components/inspector-controls';
import PostCard from './components/post-card';

/**
 * Posts Grid Block Edit Component
 *
 * @param {Object}   props               Component properties
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Block attributes update function
 * @return {JSX.Element}                Block edit component
 */
const Edit = ( { attributes, setAttributes } ) => {
	const { numberOfPosts, numberOfColumns, order } = attributes;

	// Query args
	const queryArgs = useMemo(
		() => ( {
			per_page: numberOfPosts,
			_embed: true,
			order,
		} ),
		[ numberOfPosts, order ]
	);

	// Fetch posts
	const { posts, hasResolved } = useSelect(
		( select ) => {
			const selectorArgs = [ 'postType', 'post', queryArgs ];

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
		[ queryArgs ]
	);

	const dateFormat = getSettings().formats.date;

	const blockProps = useBlockProps( {
		className: `gtb-posts-grid gtb-posts-grid--columns-${ numberOfColumns }`,
	} );

	if ( ! hasResolved ) {
		return (
			<div { ...blockProps }>
				<Spinner className="gtb-posts-grid__spinner" />
			</div>
		);
	}

	if ( ! posts?.length && hasResolved ) {
		return (
			<div { ...blockProps }>
				{ __( 'No posts found.', 'gutenblocks' ) }
			</div>
		);
	}

	return (
		<>
			<PostsGridInspector
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<div { ...blockProps }>
				{ posts?.map( ( post ) => (
					<PostCard
						key={ post.id }
						post={ post }
						attributes={ attributes }
						dateFormat={ dateFormat }
					/>
				) ) }
			</div>
		</>
	);
};

export default Edit;
