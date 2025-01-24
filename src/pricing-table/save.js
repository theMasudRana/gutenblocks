// WordPress dependencies
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Save component.
 *
 * @return {JSX.Element} Block save component.
 */
const Save = () => {
	const blockProps = useBlockProps.save( { className: 'gtb-pricing' } );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
};

export default Save;
