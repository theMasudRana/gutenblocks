/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Button, TextControl, Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addCard, help, addSubmenu } from '@wordpress/icons';
// Components.
import { Question as QuizQuestion } from './components/question';
import { QuizSelect } from './components/quiz-select';
import './editor.scss';

// Hooks.
import {
	DEFAULT_QUESTION,
	DEFAULT_QUIZ_STATE,
	useQuizData,
	useAfterSave,
} from './hooks';

export default function Edit( { attributes, setAttributes } ) {
	const { id } = attributes;
	const blockProps = useBlockProps();

	// TODO: Need to work here to fix the post save twice issue.
	const isPostSaved = useAfterSave();

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

	const { quizData, setQuizData, error, isSaving, fetchQuizData, saveQuiz } =
		useQuizData( id, ( newId ) => setAttributes( { id: newId } ) );

	const [ showForm, setShowForm ] = useState( false );

	useEffect( () => {
		if ( id && id !== 0 ) {
			fetchQuizData( id );
		} else {
			setQuizData( DEFAULT_QUIZ_STATE );
		}
	}, [ id, fetchQuizData, setQuizData ] );

	const updateQuestion = ( index, updates ) => {
		setQuizData( ( prev ) => ( {
			...prev,
			questions: prev.questions.map( ( q, idx ) =>
				idx === index ? { ...q, ...updates } : q
			),
		} ) );
	};

	const addQuestion = () => {
		setQuizData( ( prev ) => ( {
			...prev,
			questions: [ ...prev.questions, { ...DEFAULT_QUESTION } ],
			correct_answers: [ ...prev.correct_answers, '' ],
		} ) );
	};

	const removeQuestion = ( index ) => {
		setQuizData( ( prev ) => ( {
			...prev,
			questions: prev.questions.filter( ( _, idx ) => idx !== index ),
			correct_answers: prev.correct_answers.filter(
				( _, idx ) => idx !== index
			),
		} ) );
	};

	const handleCreateNew = () => {
		setQuizData( DEFAULT_QUIZ_STATE );
		setShowForm( true );
	};

	return (
		<div { ...blockProps }>
			<div className="gtb-quiz">
				<QuizSelect
					id={ id }
					quizzes={ quizzes }
					isLoading={ isLoading }
					onQuizSelect={ ( value ) => setAttributes( { id: value } ) }
					onCreateNew={ handleCreateNew }
				/>

				{ ( id !== 0 || showForm ) && (
					<div className="gtb-quiz__form">
						{ error && (
							<div className="gtb-quiz__error">{ error }</div>
						) }
						<TextControl
							label={ __( 'Quiz Title', 'gutenblocks' ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							value={ quizData.title }
							onChange={ ( value ) =>
								setQuizData( ( prev ) => ( {
									...prev,
									title: value,
								} ) )
							}
						/>

						<TextControl
							label={ __( 'Quiz Description', 'gutenblocks' ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							value={ quizData.content }
							onChange={ ( value ) =>
								setQuizData( ( prev ) => ( {
									...prev,
									content: value,
								} ) )
							}
						/>

						<h4 className="gtb-quiz__question-area-title">
							<Icon icon={ help } />
							{ __( 'Quiz Questions', 'gutenblocks' ) }
						</h4>
						<div className="gtb-quiz__questions">
							{ quizData.questions.map( ( question, index ) => (
								<QuizQuestion
									key={ index }
									question={ question }
									questionIndex={ index }
									correctAnswer={
										quizData.correct_answers[ index ]
									}
									onUpdateQuestion={ updateQuestion }
									onAddAnswer={ ( qIndex ) => {
										setQuizData( ( prev ) => ( {
											...prev,
											questions: prev.questions.map(
												( q, idx ) =>
													idx === qIndex
														? {
																...q,
																answers: [
																	...q.answers,
																	'',
																],
														  }
														: q
											),
										} ) );
									} }
									onRemoveAnswer={ ( qIndex, aIndex ) => {
										setQuizData( ( prev ) => {
											const newQuestions =
												prev.questions.map(
													( q, idx ) => {
														if ( idx === qIndex ) {
															const newAnswers =
																q.answers.filter(
																	(
																		_,
																		aIdx
																	) =>
																		aIdx !==
																		aIndex
																);
															return {
																...q,
																answers:
																	newAnswers,
															};
														}
														return q;
													}
												);

											const newCorrectAnswers = [
												...prev.correct_answers,
											];
											if (
												prev.questions[ qIndex ]
													?.answers[ aIndex ] ===
												prev.correct_answers[ qIndex ]
											) {
												newCorrectAnswers[ qIndex ] =
													newQuestions[ qIndex ]
														?.answers[ 0 ] || '';
											}

											return {
												...prev,
												questions: newQuestions,
												correct_answers:
													newCorrectAnswers,
											};
										} );
									} }
									onUpdateAnswer={ (
										qIndex,
										aIndex,
										value
									) => {
										setQuizData( ( prev ) => {
											const newQuestions =
												prev.questions.map(
													( q, idx ) =>
														idx === qIndex
															? {
																	...q,
																	answers:
																		q.answers.map(
																			(
																				ans,
																				aIdx
																			) =>
																				aIdx ===
																				aIndex
																					? value
																					: ans
																		),
															  }
															: q
												);

											const oldAnswerValue =
												prev.questions[ qIndex ]
													?.answers[ aIndex ];
											const newCorrectAnswers = [
												...prev.correct_answers,
											];
											if (
												oldAnswerValue ===
												prev.correct_answers[ qIndex ]
											) {
												newCorrectAnswers[ qIndex ] =
													value;
											}

											return {
												...prev,
												questions: newQuestions,
												correct_answers:
													newCorrectAnswers,
											};
										} );
									} }
									onSetCorrectAnswer={ ( qIndex, value ) => {
										setQuizData( ( prev ) => {
											const newCorrectAnswers = [
												...prev.correct_answers,
											];
											newCorrectAnswers[ qIndex ] = value;
											return {
												...prev,
												correct_answers:
													newCorrectAnswers,
											};
										} );
									} }
									onRemoveQuestion={ removeQuestion }
								/>
							) ) }

							<Button
								variant="secondary"
								className="gtb-quiz__add-question"
								onClick={ addQuestion }
								size="compact"
								icon={ addSubmenu }
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
							icon={ addCard }
						>
							{ isSaving
								? __( 'Saving', 'gutenblocks' )
								: __( 'Save Quiz', 'gutenblocks' ) }
						</Button>
					</div>
				) }
			</div>
		</div>
	);
}
