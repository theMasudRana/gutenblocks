// WordPress dependencies
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

// Internal dependencies
import pricingTemplate from './utils';

/**
 * Edit component.
 * @param {Object} props            - Component properties.
 * @param {Object} props.attributes - Block attributes.
 *
 * @return {JSX.Element} Block edit component.
 */
const Edit = ( { attributes } ) => {
	const { allowedBlocks } = attributes;
	const blockProps = useBlockProps( { className: 'gtb-pricing' } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks,
		template: pricingTemplate,
		templateLock: 'all',
	} );

	return <div { ...innerBlocksProps } />;
};

export default Edit;
