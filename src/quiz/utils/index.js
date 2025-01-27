/**
 * Utility functions for managing quiz block state
 */

/**
 * Updates a specific question's text
 * @param {Object} state           - Current state with questions
 * @param {number} questionIndex   - Index of question to update
 * @param {string} newQuestionText - New text for the question
 *
 * @return {Object} Updated state with modified question
 */
export const updateQuestionText = (
	state,
	questionIndex,
	newQuestionText
) => ( {
	questions: state.questions.map( ( question, index ) =>
		index === questionIndex
			? { ...question, question: newQuestionText }
			: question
	),
} );

/**
 * Updates a specific answer within a question
 * @param {Object} state         - Current state with questions
 * @param {number} questionIndex - Index of question containing the answer
 * @param {number} answerIndex   - Index of answer to update
 * @param {string} newText       - New text for the answer
 *
 * @return {Object} Updated state with modified answer
 */
export const updateAnswerText = (
	state,
	questionIndex,
	answerIndex,
	newText
) => ( {
	questions: state.questions.map( ( question, i ) =>
		i === questionIndex
			? {
					...question,
					answers: question.answers.map( ( answer, j ) =>
						j === answerIndex ? newText : answer
					),
			  }
			: question
	),
} );

/**
 * Removes an answer from a specific question
 * @param {Object} state         - Current state with questions and correct answers
 * @param {number} questionIndex - Index of question to modify
 * @param {number} answerIndex   - Index of answer to remove
 *
 * @return {Object} Updated state with answer removed
 */
export const removeAnswer = ( state, questionIndex, answerIndex ) => {
	const updatedQuestions = state.questions.map( ( question, index ) =>
		index === questionIndex
			? {
					...question,
					answers: question.answers.filter(
						( _, i ) => i !== answerIndex
					),
			  }
			: question
	);

	const updatedCorrectAnswers = state.correctAnswers.map(
		( correctAnswer, index ) => {
			if ( index !== questionIndex ) {
				return correctAnswer;
			}

			const answerCount = state.questions[ index ].answers.length;
			return correctAnswer !== null && correctAnswer < answerCount - 1
				? correctAnswer
				: null;
		}
	);

	return {
		questions: updatedQuestions,
		correctAnswers: updatedCorrectAnswers,
	};
};

/**
 * Adds a new answer to a specific question
 * @param {Object} state         - Current state with questions
 * @param {number} questionIndex - Index of question to modify
 *
 * @return {Object} Updated state with new empty answer added
 */
export const addAnswer = ( state, questionIndex ) => ( {
	questions: state.questions.map( ( question, index ) =>
		index === questionIndex
			? {
					...question,
					answers: [ ...question.answers, '' ],
			  }
			: question
	),
} );

/**
 * Sets the correct answer for a specific question
 * @param {Object} state              - Current state with correct answers
 * @param {number} questionIndex      - Index of question to modify
 * @param {number} correctAnswerIndex - Index of the correct answer
 *
 * @return {Object} Updated state with new correct answer
 */
export const setCorrectAnswer = (
	state,
	questionIndex,
	correctAnswerIndex
) => {
	const newCorrectAnswers = [ ...state.correctAnswers ];
	newCorrectAnswers[ questionIndex ] = parseInt( correctAnswerIndex, 10 );
	return { correctAnswers: newCorrectAnswers };
};

/**
 * Removes a specific question
 * @param {Object} state         - Current state with questions and correct answers
 * @param {number} questionIndex - Index of question to remove
 *
 * @return {Object} Updated state with question removed
 */
export const removeQuestion = ( state, questionIndex ) => ( {
	questions: state.questions.filter(
		( _, index ) => index !== questionIndex
	),
	correctAnswers: state.correctAnswers.filter(
		( _, index ) => index !== questionIndex
	),
} );

/**
 * Adds a new question to the quiz
 * @param {Object} state - Current state with questions and correct answers
 *
 * @return {Object} Updated state with new question added
 */
export const addQuestion = ( state ) => ( {
	questions: [ ...state.questions, { question: '', answers: [ '' ] } ],
	correctAnswers: [ ...state.correctAnswers, null ],
} );
