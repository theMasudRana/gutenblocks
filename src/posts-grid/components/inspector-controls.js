/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { BLOCK_SETTINGS } from '../constants';

/**
 * Inspector Controls Component
 *
 * @param {Object}   props               Component properties
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Block attributes update function
 * @return {JSX.Element}                Inspector controls
 */
const PostsGridInspector = ( { attributes, setAttributes } ) => {
	const {
		numberOfPosts,
		numberOfColumns,
		displayExcerpt,
		excerptLength,
		displayFeaturedImage,
		order,
	} = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Posts Grid Settings', 'gutenblocks' ) }>
				<RangeControl
					label={ __( 'Number of Posts', 'gutenblocks' ) }
					value={ numberOfPosts }
					onChange={ ( value ) =>
						setAttributes( { numberOfPosts: value } )
					}
					min={ BLOCK_SETTINGS.POSTS.MIN }
					max={ BLOCK_SETTINGS.POSTS.MAX }
				/>
				<RangeControl
					label={ __( 'Number of Columns', 'gutenblocks' ) }
					value={ numberOfColumns }
					onChange={ ( value ) =>
						setAttributes( { numberOfColumns: value } )
					}
					min={ BLOCK_SETTINGS.COLUMNS.MIN }
					max={ BLOCK_SETTINGS.COLUMNS.MAX }
				/>
				<ToggleControl
					label={ __( 'Display Featured Image', 'gutenblocks' ) }
					checked={ displayFeaturedImage }
					onChange={ ( value ) =>
						setAttributes( { displayFeaturedImage: value } )
					}
				/>
				<ToggleControl
					label={ __( 'Display Post Excerpt', 'gutenblocks' ) }
					checked={ displayExcerpt }
					onChange={ ( value ) =>
						setAttributes( { displayExcerpt: value } )
					}
				/>
				{ displayExcerpt && (
					<RangeControl
						label={ __( 'Excerpt Length', 'gutenblocks' ) }
						value={ excerptLength }
						onChange={ ( value ) =>
							setAttributes( { excerptLength: value } )
						}
						min={ BLOCK_SETTINGS.EXCERPT.MIN_LENGTH }
						max={ BLOCK_SETTINGS.EXCERPT.MAX_LENGTH }
						help={ __(
							'Number of words to show in excerpt',
							'gutenblocks'
						) }
					/>
				) }
				<SelectControl
					label={ __( 'Order', 'gutenblocks' ) }
					value={ order }
					options={ [
						{
							label: __( 'Descending', 'gutenblocks' ),
							value: 'desc',
						},
						{
							label: __( 'Ascending', 'gutenblocks' ),
							value: 'asc',
						},
					] }
					onChange={ ( value ) => setAttributes( { order: value } ) }
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default PostsGridInspector;
