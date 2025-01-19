/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Button, TextControl, RadioControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, close } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { createQuestionHandlers } from './utils/export';

/**
 * Quiz Block Edit Component
 *
 * @param {Object}   props               Component properties
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Block attributes update function
 * @return {JSX.Element}                Block edit component
 */
const Edit = ( { attributes, setAttributes } ) => {
	const { questions } = attributes;
	const {
		addQuestion,
		updateQuestion,
		addAnswer,
		updateAnswer,
		setCorrectAnswer,
		removeQuestion,
		removeAnswer,
	} = createQuestionHandlers( questions, setAttributes );

	const blockProps = useBlockProps( {
		className: 'gtb-quiz',
	} );

	return (
		<div { ...blockProps }>
			{ questions.map( ( question, questionIndex ) => (
				<div key={ questionIndex } className="gtb-quiz__question">
					<TextControl
						label={ __( 'Question', 'gutenblocks' ) }
						value={ question.question }
						className="gtb-quiz__question-input"
						onChange={ ( value ) =>
							updateQuestion( questionIndex, value )
						}
					/>

					{ question.answers.map( ( answer, answerIndex ) => (
						<div className="gtb-quiz__answer" key={ answerIndex }>
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
								isDestructive
								className="gtb-quiz__remove-answer"
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
						variant="secondary"
						onClick={ () => addAnswer( questionIndex ) }
					>
						{ __( 'Add Answer', 'gutenblocks' ) }
					</Button>

					<RadioControl
						label={ __( 'Select Correct Answer', 'gutenblocks' ) }
						className="gtb-quiz__correct-answer"
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
						isDestructive
						onClick={ () => removeQuestion( questionIndex ) }
						className="gtb-quiz__remove-question"
					>
						<Icon icon={ close } />
					</Button>
				</div>
			) ) }

			<Button variant="primary" onClick={ addQuestion }>
				{ __( 'Add Question', 'gutenblocks' ) }
			</Button>
		</div>
	);
};

export default Edit;
