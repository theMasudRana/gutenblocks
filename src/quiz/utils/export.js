// Helper functions for managing questions state
export const createUpdateQuestions =
	( questions, setAttributes ) => ( updater ) => {
		const newQuestions = [ ...questions ];
		updater( newQuestions );
		setAttributes( { questions: newQuestions } );
	};

export const createQuestionHandlers = ( questions, setAttributes ) => {
	const updateQuestions = createUpdateQuestions( questions, setAttributes );

	return {
		addQuestion: () => {
			setAttributes( {
				questions: [
					...questions,
					{
						question: '',
						answers: [ '' ],
						correctAnswer: 0,
					},
				],
			} );
		},

		updateQuestion: ( index, question ) => {
			updateQuestions( ( questions ) => {
				questions[ index ].question = question;
			} );
		},

		addAnswer: ( questionIndex ) => {
			updateQuestions( ( questionsList ) => {
				questionsList[ questionIndex ].answers.push( '' );
			} );
		},

		updateAnswer: ( questionIndex, answerIndex, answer ) => {
			updateQuestions( ( questionsList ) => {
				questionsList[ questionIndex ].answers[ answerIndex ] = answer;
			} );
		},

		setCorrectAnswer: ( questionIndex, correctAnswer ) => {
			updateQuestions( ( questionsList ) => {
				questionsList[ questionIndex ].correctAnswer = parseInt(
					correctAnswer,
					10
				);
			} );
		},

		removeQuestion: ( index ) => {
			setAttributes( {
				questions: questions.filter( ( _, i ) => i !== index ),
			} );
		},

		removeAnswer: ( questionIndex, answerIndex ) => {
			updateQuestions( ( questionsList ) => {
				questionsList[ questionIndex ].answers = questionsList[
					questionIndex
				].answers.filter( ( _, i ) => i !== answerIndex );
			} );
		},
	};
};
