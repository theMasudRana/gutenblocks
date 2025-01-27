/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

// Quiz functionality
const { state } = store( 'gutenblocks/quiz', {
	actions: {
		resetQuiz: () => {
			const dilogElement = document.querySelector(
				'.gtb-quiz__status-dialog'
			);

			state.answered = 0;
			state.correct = 0;
			state.allCorrect = false;

			// Reset all radio inputs
			const allInputs = document.querySelectorAll(
				'.gtb-quiz__answer-input'
			);
			allInputs.forEach( ( input ) => {
				input.checked = false;
			} );

			// Close dialog if open
			if ( dilogElement && dilogElement.open ) {
				dilogElement.close();
			}
		},
		checkAnswers: () => {
			const { questions } = getContext();
			const checkedInputs = document.querySelectorAll(
				'.gtb-quiz__answer-input:checked'
			);
			const dilogElement = document.querySelector(
				'.gtb-quiz__status-dialog'
			);
			const answerMap = new Map(
				Array.from( checkedInputs ).map( ( input ) => [
					parseInt( input.name.split( '_' )[ 1 ], 10 ),
					input.value,
				] )
			);

			// Reset previous results before checking
			state.answered = 0;
			state.correct = 0;

			// Calculate correct answers
			questions.forEach( ( question, index ) => {
				const userAnswer = answerMap.get( index );
				if ( userAnswer ) {
					state.answered++;
					if (
						userAnswer === question.answers[ state.list[ index ] ]
					) {
						state.correct++;
					}
				}
			} );

			// Update necessary state
			state.allCorrect =
				state.answered === questions.length &&
				state.correct === questions.length;

			dilogElement.showModal();
		},
		modalClose: () => {
			const dilogElement = document.querySelector(
				'.gtb-quiz__status-dialog'
			);

			// Reset all quiz state and inputs
			state.answered = 0;
			state.correct = 0;
			state.allCorrect = false;

			// Reset all radio inputs
			const allInputs = document.querySelectorAll(
				'.gtb-quiz__answer-input'
			);
			allInputs.forEach( ( input ) => {
				input.checked = false;
			} );

			// Close the dialog
			dilogElement.close();
		},
	},
} );
