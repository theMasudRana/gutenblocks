/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Button, TextControl, RadioControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, close } from '@wordpress/icons';

// Internal dependencies
import {
	updateQuestionText,
	updateAnswerText,
	removeAnswer,
	addAnswer,
	setCorrectAnswer,
	removeQuestion,
	addQuestion,
} from './utils';

/**
 * Quiz Block Edit Component
 *
 * @param {Object}   props               Component properties
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Block attributes update function
 *
 * @return {JSX.Element}                Block edit component
 */
const Edit = ( { attributes, setAttributes } ) => {
	const { questions = [], correctAnswers = [] } = attributes;

	/**
	 * Generates an attribute update function that preserves existing state
	 *
	 * @param {Function} updater - Function to generate new attribute state
	 */
	const updateAttribute = ( updater ) => {
		setAttributes( updater( { questions, correctAnswers } ) );
	};

	return (
		<div { ...useBlockProps() }>
			{ questions.map( ( question, questionIndex ) => (
				<div key={ questionIndex } className="gtb-quiz__question">
					<TextControl
						label={ __( 'Enter Question Title', 'gutenblocks' ) }
						value={ question.question }
						className="gtb-quiz__question-title"
						__nextHasNoMarginBottom={ false }
						onChange={ ( value ) =>
							updateAttribute( ( state ) =>
								updateQuestionText(
									state,
									questionIndex,
									value
								)
							)
						}
					/>

					{ question.answers.map( ( answer, answerIndex ) => (
						<div key={ answerIndex } className="gtb-quiz__answer">
							<TextControl
								label={ __( 'Answer', 'gutenblocks' ) }
								value={ answer }
								__nextHasNoMarginBottom={ true }
								onChange={ ( value ) =>
									updateAttribute( ( state ) =>
										updateAnswerText(
											state,
											questionIndex,
											answerIndex,
											value
										)
									)
								}
							/>
							<Button
								className="gtb-quiz__remove-answer"
								isDestructive
								onClick={ () =>
									updateAttribute( ( state ) =>
										removeAnswer(
											state,
											questionIndex,
											answerIndex
										)
									)
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
						onClick={ () =>
							updateAttribute( ( state ) =>
								addAnswer( state, questionIndex )
							)
						}
					>
						{ __( 'Add Answer', 'gutenblocks' ) }
					</Button>

					<RadioControl
						className="gtb-quiz__correct-answer"
						label={ __( 'Correct Answer', 'gutenblocks' ) }
						selected={
							correctAnswers[ questionIndex ] !== null &&
							correctAnswers[ questionIndex ] !== undefined
								? (
										correctAnswers[ questionIndex ] ?? ''
								  ).toString()
								: undefined
						}
						options={ question.answers.map( ( answer, index ) => ( {
							label: answer || `Answer ${ index + 1 }`,
							value: index.toString(),
						} ) ) }
						onChange={ ( value ) =>
							updateAttribute( ( state ) =>
								setCorrectAnswer( state, questionIndex, value )
							)
						}
					/>

					<Button
						className="gtb-quiz__remove-question"
						isDestructive
						onClick={ () =>
							updateAttribute( ( state ) =>
								removeQuestion( state, questionIndex )
							)
						}
					>
						<Icon icon={ close } />
					</Button>
				</div>
			) ) }

			<Button
				variant="primary"
				onClick={ () =>
					updateAttribute( ( state ) => addQuestion( state ) )
				}
				className="gtb-quiz__add-question"
			>
				{ __( 'Add Question', 'gutenblocks' ) }
			</Button>
		</div>
	);
};

export default Edit;
