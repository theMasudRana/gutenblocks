import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Panel,
	PanelBody,
	PanelRow,
	RadioControl,
	TextControl,
	Icon,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { close, plus } from '@wordpress/icons';
import './editor.scss';

/**
 * Edit component for the Quiz block
 *
 * @param {Object} props - The component props
 * @param {Object} props.attributes - The block attributes
 * @param {Function} props.setAttributes - The function to update the block attributes
 * @returns {JSX.Element} The Edit component
 */
export default function Edit( { attributes, setAttributes } ) {
	const { title, questions, correctAnswers } = attributes;
	const blockProps = useBlockProps();

	console.log( questions );

	// Update quiz title
	const updateQuizTitle = ( value ) => {
		setAttributes( { title: value } );
	};

	// Add a new question
	const addQuestion = () => {
		setAttributes( {
			questions: [ ...questions, { question: '', answers: [ '' ] } ],
			correctAnswers: [ ...correctAnswers, 0 ],
		} );
	};

	const removeQuestion = ( index ) => {
		setAttributes( {
			questions: questions.filter( ( _, i ) => i !== index ),
			correctAnswers: correctAnswers.filter( ( _, i ) => i !== index ),
		} );
	};

	const updateQuestion = ( index, value ) => {
		const updatedQuestions = [ ...questions ];
		updatedQuestions[ index ] = {
			...updatedQuestions[ index ],
			question: value,
		};
		setAttributes( { questions: updatedQuestions } );
	};

	const updateAnswer = ( questionIndex, answerIndex, value ) => {
		const updatedQuestions = [ ...questions ];
		updatedQuestions[ questionIndex ] = {
			...updatedQuestions[ questionIndex ],
			answers: updatedQuestions[ questionIndex ].answers.map(
				( answer, i ) => ( i === answerIndex ? value : answer )
			),
		};
		setAttributes( { questions: updatedQuestions } );
	};

	const addAnswer = ( questionIndex ) => {
		const updatedQuestions = [ ...questions ];
		updatedQuestions[ questionIndex ] = {
			...updatedQuestions[ questionIndex ],
			answers: [ ...updatedQuestions[ questionIndex ].answers, '' ],
		};
		setAttributes( { questions: updatedQuestions } );
	};

	const removeAnswer = ( questionIndex, answerIndex ) => {
		const updatedQuestions = [ ...questions ];
		updatedQuestions[ questionIndex ] = {
			...updatedQuestions[ questionIndex ],
			answers: updatedQuestions[ questionIndex ].answers.filter(
				( _, i ) => i !== answerIndex
			),
		};
		setAttributes( { questions: updatedQuestions } );
	};

	const setCorrectAnswer = ( questionIndex, value ) => {
		const updatedCorrectAnswers = [ ...correctAnswers ];
		updatedCorrectAnswers[ questionIndex ] = parseInt( value );
		setAttributes( { correctAnswers: updatedCorrectAnswers } );
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Quiz Settings', 'gutenblocks' ) }
					className="quiz-settings"
					initialOpen={ true }
				></PanelBody>
			</InspectorControls>

			<div className="gtb-quiz">
				<TextControl
					label={ __( 'Quiz Title', 'gutenblocks' ) }
					__nextHasNoMarginBottom={ false }
					__next40pxDefaultSize={ true }
					value={ title }
					onChange={ updateQuizTitle }
				/>

				{ questions.map( ( question, index ) => (
					<Panel
						className="gtbc-quiz__question"
						key={ `question-${ index }` }
					>
						<PanelBody
							title={ `Question ${ index + 1 }` }
							initialOpen={ 0 === index ? true : false }
						>
							<PanelRow className="gtbc-quiz__question-title">
								<TextControl
									label={ __( 'Title', 'gutenblocks' ) }
									__nextHasNoMarginBottom={ true }
									value={ question.question }
									onChange={ ( value ) =>
										updateQuestion( index, value )
									}
								/>

								{ question?.answers?.map(
									( answer, answerIndex ) => (
										<div
											key={ answerIndex }
											className="gtb-quiz__answer"
										>
											<TextControl
												label={ __(
													'Answer',
													'gutenblocks'
												) }
												value={ answer }
												__nextHasNoMarginBottom={ true }
												onChange={ ( value ) =>
													updateAnswer(
														index,
														answerIndex,
														value
													)
												}
											/>
											<Button
												className="gtb-quiz__remove-answer"
												isDestructive
												onClick={ () =>
													removeAnswer(
														index,
														answerIndex
													)
												}
												disabled={
													question?.answers?.length <=
													1
												}
											>
												<Icon icon={ close } />
											</Button>
										</div>
									)
								) }

								<Button
									className="gtb-quiz__add-answer"
									variant="secondary"
									onClick={ () => addAnswer( index ) }
								>
									{ __( 'Add Answer', 'gutenblocks' ) }
								</Button>

								<RadioControl
									className="gtb-quiz__correct-answer"
									label={ __(
										'Correct Answer',
										'gutenblocks'
									) }
									selected={
										correctAnswers[ index ] !== null &&
										correctAnswers[ index ] !== undefined
											? (
													correctAnswers[ index ] ??
													''
											  ).toString()
											: undefined
									}
									options={ question.answers.map(
										( answer, index ) => ( {
											label:
												answer ||
												`Answer ${ index + 1 }`,
											value: index.toString(),
										} )
									) }
									onChange={ ( value ) =>
										setCorrectAnswer( index, value )
									}
								/>
							</PanelRow>
							<Button
								icon={ close }
								onClick={ () => removeQuestion( index ) }
							>
								{ __( 'Remove', 'gutenblocks' ) }
							</Button>
						</PanelBody>
					</Panel>
				) ) }

				<Button
					variant="primary"
					onClick={ addQuestion }
					icon={ plus }
					style={ { marginTop: '16px' } }
				>
					{ __( 'Add Question', 'gutenblocks' ) }
				</Button>
			</div>
		</div>
	);
}
