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
	const { questions } = attributes;

	// Add a new question
	const addQuestion = () => {
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
	};

	// Remove a question
	const removeQuestion = ( indexToRemove ) => {
		setAttributes( {
			questions: questions.filter(
				( _, index ) => index !== indexToRemove
			),
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
		setAttributes( {
			questions: questions.map( ( q, i ) =>
				i === questionIndex
					? {
							...q,
							answers: q.answers.filter(
								( _, j ) => j !== answerIndex
							),
					  }
					: q
			),
		} );
	};

	// Set the correct answer
	const setCorrectAnswer = ( questionIndex, answer ) => {
		setAttributes( {
			questions: questions.map( ( q, i ) =>
				i === questionIndex
					? { ...q, correctAnswer: parseInt( answer, 10 ) }
					: q
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
						selected={ question.correctAnswer.toString() }
						options={ question.answers.map( ( answer, index ) => ( {
							label: answer || `Answer ${ index + 1 }`,
							value: index.toString(),
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
