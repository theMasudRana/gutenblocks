/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Constants for the quiz data.
 */
export const DEFAULT_QUIZ_STATE = {
	title: '',
	content: '',
	questions: [],
	correct_answers: [],
};

/**
 * Constants for the quiz question.
 */
export const DEFAULT_QUESTION = {
	question: '',
	answers: [ '' ],
};

/**
 * Hook to fetch and save the quiz data.
 *
 * @param {number} id The ID of the quiz.
 * @param {function} onSaveSuccess The function to call when the quiz is saved.
 * @return {object} The quiz data.
 */
export const useQuizData = ( id, onSaveSuccess ) => {
	const [ quizData, setQuizData ] = useState( DEFAULT_QUIZ_STATE );
	const [ error, setError ] = useState( null );
	const [ isSaving, setIsSaving ] = useState( false );

	const fetchQuizData = useCallback( async ( quizId ) => {
		try {
			setError( null );
			const response = await apiFetch( {
				path: `/gutenblocks/v1/quizzes/${ quizId }`,
			} );

			if ( ! response ) {
				throw new Error( 'Quiz not found' );
			}

			setQuizData( {
				title: response.title || '',
				content: response.content || '',
				questions: response.questions || [],
				correct_answers: response.correct_answers || [],
			} );
		} catch ( err ) {
			setError(
				__(
					'Failed to load quiz data. Please try again.',
					'gutenblocks'
				)
			);
			setQuizData( DEFAULT_QUIZ_STATE );
		}
	}, [] );

	/**
	 * Hook to save the quiz data.
	 *
	 * @return {void}
	 */
	const saveQuiz = async () => {
		// If the quiz is already saving, don't save it again.
		if ( isSaving ) {
			return;
		}

		try {
			setIsSaving( true );
			setError( null );

			const response = await apiFetch( {
				path: id
					? `/gutenblocks/v1/quizzes/${ id }`
					: '/gutenblocks/v1/quizzes',
				method: id ? 'PUT' : 'POST',
				data: quizData,
			} );

			if ( ! id ) {
				onSaveSuccess( response.id );
			}
		} catch ( err ) {
			setError(
				__( 'Failed to save quiz. Please try again.', 'gutenblocks' )
			);
		} finally {
			setIsSaving( false );
		}
	};

	return {
		quizData,
		setQuizData,
		error,
		isSaving,
		fetchQuizData,
		saveQuiz,
	};
};

/**
 * Returns `true` if the post is done saving, `false` otherwise.
 *
 * @return {boolean} True if the post is done saving, false otherwise.
 */
export const useAfterSave = () => {
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
