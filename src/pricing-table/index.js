// WordPress dependencies
import { registerBlockType } from '@wordpress/blocks';

// Internal dependencies
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

// Register the block
registerBlockType( metadata.name, {
	edit: Edit,
	save: Save,
} );
