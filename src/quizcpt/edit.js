/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useBlockProps } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	Icon,
	RadioControl,
	SelectControl,
	Spinner,
	TextControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { close, plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';
import useAfterSave from './utils';

const DEFAULT_QUIZ_STATE = {
	title: '',
	content: '',
	questions: [],
	correct_answers: [],
};

const DEFAULT_QUESTION = {
	question: '',
	answers: [ '' ],
};

export default function Edit( { attributes, setAttributes } ) {
	const { id } = attributes;
	const [ quizData, setQuizData ] = useState( DEFAULT_QUIZ_STATE );
	const [ error, setError ] = useState( null );
	const [ isSaving, setIsSaving ] = useState( false );

	const blockProps = useBlockProps();
	// TODO: Save and update the quiz data when the post is saved.
	const isPostSaved = useAfterSave();

	// Get all quizzes for the select control.
	const { quizzes, isLoading } = useSelect( ( select ) => ( {
		quizzes:
			select( 'core' ).getEntityRecords( 'postType', 'quiz', {
				per_page: -1,
			} ) || [],
		isLoading: select( 'core' ).isResolving( 'getEntityRecords', [
			'postType',
			'quiz',
			{ per_page: -1 },
		] ),
	} ) );

	// Fetch a single quiz data.
	const fetchQuizData = useCallback( async ( quizId ) => {
		try {
			setError( null );
			const response = await apiFetch( {
				path: `/gutenblocks/v1/quizzes/${ quizId }`,
			} );

			if ( ! response ) {
				throw new Error( 'Quiz not found' );
			}

			// Set the quiz data.
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

	// Fetch the quiz data when the quiz id changes.
	useEffect( () => {
		if ( id && id !== 0 ) {
			fetchQuizData( id );
		} else {
			setQuizData( DEFAULT_QUIZ_STATE );
		}
	}, [ id, fetchQuizData ] );

	// Update a question.
	const updateQuestion = useCallback( ( index, updates ) => {
		setQuizData( ( prev ) => ( {
			...prev,
			questions: prev.questions.map( ( q, idx ) =>
				idx === index ? { ...q, ...updates } : q
			),
		} ) );
	}, [] );

	// Add an answer to a question.
	const addAnswer = useCallback( ( questionIndex ) => {
		setQuizData( ( prev ) => ( {
			...prev,
			questions: prev.questions.map( ( q, idx ) =>
				idx === questionIndex
					? { ...q, answers: [ ...q.answers, '' ] }
					: q
			),
		} ) );
	}, [] );

	// Remove an answer from a question.
	const removeAnswer = useCallback( ( questionIndex, answerIndex ) => {
		setQuizData( ( prev ) => {
			const newQuestions = prev.questions.map( ( q, idx ) => {
				if ( idx === questionIndex ) {
					const newAnswers = q.answers.filter(
						( _, aIdx ) => aIdx !== answerIndex
					);
					return { ...q, answers: newAnswers };
				}
				return q;
			} );

			// Update correct_answers if the removed answer was selected.
			const newCorrectAnswers = [ ...prev.correct_answers ];
			if (
				prev.questions[ questionIndex ]?.answers[ answerIndex ] ===
				prev.correct_answers[ questionIndex ]
			) {
				newCorrectAnswers[ questionIndex ] =
					newQuestions[ questionIndex ]?.answers[ 0 ] || '';
			}

			return {
				...prev,
				questions: newQuestions,
				correct_answers: newCorrectAnswers,
			};
		} );
	}, [] );

	// Update an answer.
	const updateAnswer = useCallback(
		( questionIndex, answerIndex, newValue ) => {
			setQuizData( ( prev ) => {
				const newQuestions = prev.questions.map( ( q, idx ) =>
					idx === questionIndex
						? {
								...q,
								answers: q.answers.map( ( ans, aIdx ) =>
									aIdx === answerIndex ? newValue : ans
								),
						  }
						: q
				);

				// Update correct_answer if it matches the old answer value
				const oldAnswerValue =
					prev.questions[ questionIndex ]?.answers[ answerIndex ];
				const newCorrectAnswers = [ ...prev.correct_answers ];
				if (
					oldAnswerValue === prev.correct_answers[ questionIndex ]
				) {
					newCorrectAnswers[ questionIndex ] = newValue;
				}

				return {
					...prev,
					questions: newQuestions,
					correct_answers: newCorrectAnswers,
				};
			} );
		},
		[]
	);

	// Add a question.
	const addQuestion = useCallback( () => {
		setQuizData( ( prev ) => ( {
			...prev,
			questions: [ ...prev.questions, { ...DEFAULT_QUESTION } ],
			correct_answers: [ ...prev.correct_answers, '' ],
		} ) );
	}, [] );

	// Remove a question.
	const removeQuestion = useCallback( ( index ) => {
		setQuizData( ( prev ) => ( {
			...prev,
			questions: prev.questions.filter( ( _, idx ) => idx !== index ),
			correct_answers: prev.correct_answers.filter(
				( _, idx ) => idx !== index
			),
		} ) );
	}, [] );

	// Save the quiz.
	const saveQuiz = async () => {
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
				setAttributes( { id: response.id } );
			}
		} catch ( err ) {
			setError(
				__( 'Failed to save quiz. Please try again.', 'gutenblocks' )
			);
		} finally {
			setIsSaving( false );
		}
	};

	return (
		<div { ...blockProps }>
			<div className="gtb-quiz">
				{ isLoading ? (
					<div className="gtb-quiz__select-loading">
						<Spinner />
						{ __( 'Loading quizzes', 'gutenblocks' ) }
					</div>
				) : (
					<div className="gtb-quiz__select">
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Select a quiz', 'gutenblocks' ) }
							value={ id }
							onChange={ ( value ) => {
								setAttributes( {
									id: parseInt( value, 10 ),
								} );
							} }
							options={ [
								{
									label: __( 'Select a quiz', 'gutenblocks' ),
									value: 0,
								},
								...quizzes.map( ( quiz ) => ( {
									label: quiz.title.rendered,
									value: quiz.id,
								} ) ),
							] }
						/>

						{ id === 0 && (
							<BaseControl
								className="gtb-quiz__create-button"
								__nextHasNoMarginBottom
								label={ __(
									'Or Create New Quiz',
									'gutenblocks'
								) }
								id="gtb-quiz-create-button"
							>
								<Button
									variant="primary"
									onClick={ () =>
										setQuizData( DEFAULT_QUIZ_STATE )
									}
								>
									<Icon icon={ plus } />
									{ __( 'Create Quiz', 'gutenblocks' ) }
								</Button>
							</BaseControl>
						) }
					</div>
				) }

				{ error && <div className="gtb-quiz__error">{ error }</div> }

				<div className="gtb-quiz__form">
					<TextControl
						label={ __( 'Quiz Title', 'gutenblocks' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={ quizData.title }
						onChange={ ( value ) => {
							setQuizData( ( prev ) => ( {
								...prev,
								title: value,
							} ) );
						} }
					/>

					<TextControl
						label={ __( 'Quiz Description', 'gutenblocks' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={ quizData.content }
						onChange={ ( value ) => {
							setQuizData( ( prev ) => ( {
								...prev,
								content: value,
							} ) );
						} }
					/>

					<h4>{ __( 'Quiz Questions', 'gutenblocks' ) }</h4>
					<div className="gtb-quiz__questions">
						{ quizData.questions.map(
							( question, questionIndex ) => (
								<div
									className="gtb-quiz__question"
									key={ questionIndex }
								>
									<div className="gtb-quiz__question-info">
										<TextControl
											label={ __(
												'Question',
												'gutenblocks'
											) }
											className="gtb-quiz__question-title"
											__nextHasNoMarginBottom
											__next40pxDefaultSize
											value={ question.question }
											onChange={ ( value ) =>
												updateQuestion( questionIndex, {
													question: value,
												} )
											}
										/>

										<div className="gtb-quiz__answers">
											{ question.answers.map(
												( answer, answerIndex ) => (
													<BaseControl
														key={ `${ questionIndex }-answer-${ answerIndex }` }
														className="gtb-quiz__answer"
														__nextHasNoMarginBottom
														label={ __(
															'Answer',
															'gutenblocks'
														) }
														id={ `gtb-quiz-answer-${ questionIndex }-${ answerIndex }` }
													>
														<div className="gtb-quiz__answer-row">
															<TextControl
																__nextHasNoMarginBottom
																value={ answer }
																onChange={ (
																	value
																) =>
																	updateAnswer(
																		questionIndex,
																		answerIndex,
																		value
																	)
																}
															/>
															{ question.answers
																.length > 1 && (
																<Button
																	className="gtb-quiz__remove-answer"
																	isDestructive
																	onClick={ () =>
																		removeAnswer(
																			questionIndex,
																			answerIndex
																		)
																	}
																>
																	<Icon
																		icon={
																			close
																		}
																	/>
																</Button>
															) }
														</div>
													</BaseControl>
												)
											) }

											<Button
												variant="secondary"
												className="gtb-quiz__add-answer"
												onClick={ () =>
													addAnswer( questionIndex )
												}
											>
												{ __(
													'Add Answer',
													'gutenblocks'
												) }
											</Button>
										</div>

										<RadioControl
											label={ __(
												'Correct Answer',
												'gutenblocks'
											) }
											selected={
												quizData.correct_answers[
													questionIndex
												]
											}
											options={ question.answers.map(
												( answer ) => ( {
													label:
														answer ||
														__(
															'(empty)',
															'gutenblocks'
														),
													value: answer,
												} )
											) }
											onChange={ ( value ) => {
												const newCorrectAnswers = [
													...quizData.correct_answers,
												];
												newCorrectAnswers[
													questionIndex
												] = value;
												setQuizData( ( prev ) => ( {
													...prev,
													correct_answers:
														newCorrectAnswers,
												} ) );
											} }
										/>
									</div>

									<Button
										variant="secondary"
										isDestructive
										className="gtb-quiz__remove-question"
										onClick={ () =>
											removeQuestion( questionIndex )
										}
									>
										<Icon icon={ close } />
									</Button>
								</div>
							)
						) }

						<Button
							variant="secondary"
							className="gtb-quiz__add-question"
							onClick={ addQuestion }
						>
							{ __( 'Add Question', 'gutenblocks' ) }
						</Button>
					</div>

					<Button
						variant="primary"
						className="gtb-quiz__save"
						onClick={ saveQuiz }
						isBusy={ isSaving }
						disabled={ isSaving }
					>
						{ isSaving
							? __( 'Saving', 'gutenblocks' )
							: __( 'Save Quiz', 'gutenblocks' ) }
					</Button>
				</div>
			</div>
		</div>
	);
}
