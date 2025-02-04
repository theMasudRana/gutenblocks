import { useBlockProps } from '@wordpress/block-editor';
import { useRef, useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Returns `true` if the post is done saving, `false` otherwise.
 *
 * @returns {Boolean}
 */
const useAfterSave = () => {
	const [ isPostSaved, setIsPostSaved ] = useState( false );
	const isPostSavingInProgress = useRef( false );
	const { isSavingPost, isAutosavingPost } = useSelect( ( __select ) => {
		return {
			isSavingPost: __select( 'core/editor' ).isSavingPost(),
			isAutosavingPost: __select( 'core/editor' ).isAutosavingPost(),
		};
	} );

	useEffect( () => {
		if (
			( isSavingPost || isAutosavingPost ) &&
			! isPostSavingInProgress.current
		) {
			setIsPostSaved( false );
			isPostSavingInProgress.current = true;
		}
		if (
			! ( isSavingPost || isAutosavingPost ) &&
			isPostSavingInProgress.current
		) {
			// Code to run after post is done saving.
			setIsPostSaved( true );
			isPostSavingInProgress.current = false;
		}
	}, [ isSavingPost, isAutosavingPost ] );

	return isPostSaved;
};

export default useAfterSave;
