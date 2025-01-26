/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Button, TextControl, RadioControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, close } from '@wordpress/icons';

/**
 * Quiz Block Edit Component
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Block attributes update function
 *
 * @return {JSX.Element}                Block edit component
 */
const Edit = ( { attributes, setAttributes } ) => {
	const { questions, correctAnswers } = attributes;

	// Add a new question
	const addQuestion = () => {
		const newQuestions = [
			...questions,
			{
				question: '',
				answers: [ '' ],
			},
		];

		setAttributes( {
			questions: newQuestions,
			correctAnswers: [ ...correctAnswers, 0 ], // Default correct answer index is 0
		} );
	};

	// Remove a question
	const removeQuestion = ( indexToRemove ) => {
		const newQuestions = questions.filter(
			( _, index ) => index !== indexToRemove
		);
		const newCorrectAnswers = correctAnswers.filter(
			( _, index ) => index !== indexToRemove
		);

		setAttributes( {
			questions: newQuestions,
			correctAnswers: newCorrectAnswers,
		} );
	};

	// Update a question
	const updateQuestion = ( index, newQuestion ) => {
		setAttributes( {
			questions: questions.map( ( q, i ) =>
				i === index ? { ...q, question: newQuestion } : q
			),
		} );
	};

	// Add a new answer
	const addAnswer = ( questionIndex ) => {
		setAttributes( {
			questions: questions.map( ( q, i ) =>
				i === questionIndex
					? { ...q, answers: [ ...q.answers, '' ] }
					: q
			),
		} );
	};

	// Update an answer
	const updateAnswer = ( questionIndex, answerIndex, newAnswer ) => {
		setAttributes( {
			questions: questions.map( ( q, i ) =>
				i === questionIndex
					? {
							...q,
							answers: q.answers.map( ( a, j ) =>
								j === answerIndex ? newAnswer : a
							),
					  }
					: q
			),
		} );
	};

	// Remove an answer
	const removeAnswer = ( questionIndex, answerIndex ) => {
		const newQuestions = questions.map( ( q, i ) =>
			i === questionIndex
				? {
						...q,
						answers: q.answers.filter(
							( _, j ) => j !== answerIndex
						),
				  }
				: q
		);

		// Adjust the correct answer index if the removed answer was before the correct answer
		const newCorrectAnswers = correctAnswers.map( ( ca, i ) =>
			i === questionIndex && answerIndex < ca ? ca - 1 : ca
		);

		setAttributes( {
			questions: newQuestions,
			correctAnswers: newCorrectAnswers,
		} );
	};

	// Set the correct answer
	const setCorrectAnswer = ( questionIndex, answer ) => {
		const newCorrectAnswer = parseInt( answer, 10 );

		setAttributes( {
			correctAnswers: correctAnswers.map( ( ca, i ) =>
				i === questionIndex ? newCorrectAnswer : ca
			),
		} );
	};

	return (
		<div { ...useBlockProps() }>
			{ questions.map( ( question, questionIndex ) => (
				<div key={ questionIndex } className="gtb-quiz__question">
					<TextControl
						label={ __( 'Question', 'gutenblocks' ) }
						value={ question.question }
						onChange={ ( value ) =>
							updateQuestion( questionIndex, value )
						}
					/>

					{ question.answers.map( ( answer, answerIndex ) => (
						<div key={ answerIndex } className="gtb-quiz__answer">
							<TextControl
								label={ __( 'Answer', 'gutenblocks' ) }
								value={ answer }
								onChange={ ( value ) =>
									updateAnswer(
										questionIndex,
										answerIndex,
										value
									)
								}
							/>
							<Button
								className="gtb-quiz__remove-answer"
								isDestructive
								onClick={ () =>
									removeAnswer( questionIndex, answerIndex )
								}
								disabled={ question.answers.length <= 1 }
							>
								<Icon icon={ close } />
							</Button>
						</div>
					) ) }

					<Button
						className="gtb-quiz__add-answer"
						variant="secondary"
						onClick={ () => addAnswer( questionIndex ) }
					>
						{ __( 'Add Answer', 'gutenblocks' ) }
					</Button>

					<RadioControl
						className="gtb-quiz__correct-answer"
						label={ __( 'Correct Answer', 'gutenblocks' ) }
						selected={ correctAnswers[ questionIndex ]?.toString() }
						options={ question.answers.map( ( answer, index ) => ( {
							label: answer || `Answer ${ index + 1 }`,
							value: index?.toString(),
						} ) ) }
						onChange={ ( value ) =>
							setCorrectAnswer( questionIndex, value )
						}
					/>

					<Button
						className="gtb-quiz__remove-question"
						isDestructive
						onClick={ () => removeQuestion( questionIndex ) }
					>
						<Icon icon={ close } />
					</Button>
				</div>
			) ) }

			<Button
				variant="primary"
				onClick={ addQuestion }
				className="gtb-quiz__add-question"
			>
				{ __( 'Add Question', 'gutenblocks' ) }
			</Button>
		</div>
	);
};

export default Edit;
