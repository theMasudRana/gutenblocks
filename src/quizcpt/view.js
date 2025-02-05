/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

// Constants for selectors.
const SELECTORS = {
	DIALOG: '.gtb-quiz__status-dialog',
	ANSWER_INPUT: '.gtb-quiz__answer-input',
};

// API endpoint.
const API_ENDPOINT = '/wp-json/gutenblocks/v1/quizzes';

// Initial state
const initialState = {
	answered: 0,
	correct: 0,
	allCorrect: false,
	modal_title: 'Quiz Results',
};

// Get checked answers.
const getCheckedAnswers = () => {
	const inputs = document.querySelectorAll(
		SELECTORS.ANSWER_INPUT + ':checked'
	);
	return Array.from( inputs ).map( ( input ) => ( {
		questionIndex: parseInt( input.name.split( '_' )[ 1 ], 10 ),
		answer: input.value,
	} ) );
};

// Reset inputs.
const resetInputs = () => {
	document
		.querySelectorAll( SELECTORS.ANSWER_INPUT )
		.forEach( ( input ) => ( input.checked = false ) );
};

// Get dialog.
const getDialog = () => document.querySelector( SELECTORS.DIALOG );

// Store configuration.
const { state } = store( 'gutenblocks/quizcpt', {
	actions: {
		resetQuiz: () => {
			Object.assign( state, initialState );
			resetInputs();

			const dialog = getDialog();
			if ( dialog?.open ) {
				dialog.close();
			}
		},

		async checkAnswers() {
			try {
				// Fetch quiz data.
				const response = await fetch(
					`${ state.site_url }${ API_ENDPOINT }/${ state.quiz_id }`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				if ( ! response.ok ) {
					throw new Error( 'Failed to fetch quiz data' );
				}

				const data = await response.json();
				const { questions, correct_answers: correctAnswers } = data;

				// Reset state.
				state.answered = 0;
				state.correct = 0;
				state.modal_title = state.modal_title;

				// Get user answers.
				const userAnswers = getCheckedAnswers();
				state.answered = userAnswers.length;

				// Check answers.
				state.correct = userAnswers.reduce(
					( correct, { questionIndex, answer } ) =>
						correct +
						( answer === correctAnswers[ questionIndex ] ? 1 : 0 ),
					0
				);

				// Update completion state.
				state.allCorrect =
					state.answered === questions.length &&
					state.correct === questions.length;

				// Update dialog title.
				state.modal_title = state.allCorrect
					? state.all_correct_title
					: state.modal_title;

				// Show results.
				getDialog()?.showModal();
			} catch ( error ) {
				throw new Error( 'Failed to check answers' );
			}
		},

		// Close dialog.
		modalClose: () => {
			Object.assign( state, initialState );
			resetInputs();
			getDialog()?.close();
		},
	},
} );
