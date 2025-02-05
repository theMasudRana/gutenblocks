/**
 * WordPress dependencies
 */
import {
	BaseControl,
	Button,
	Icon,
	RadioControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { close } from '@wordpress/icons';

export const Question = ( {
	question,
	questionIndex,
	correctAnswer,
	onUpdateQuestion,
	onAddAnswer,
	onRemoveAnswer,
	onUpdateAnswer,
	onSetCorrectAnswer,
	onRemoveQuestion,
} ) => (
	<div className="gtb-quiz__question">
		<div className="gtb-quiz__question-info">
			<TextControl
				label={ __( 'Question', 'gutenblocks' ) }
				className="gtb-quiz__question-title"
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				value={ question.question }
				onChange={ ( value ) =>
					onUpdateQuestion( questionIndex, { question: value } )
				}
			/>

			<div className="gtb-quiz__answers">
				{ question.answers.map( ( answer, answerIndex ) => (
					<BaseControl
						key={ `${ questionIndex }-answer-${ answerIndex }` }
						className="gtb-quiz__answer"
						__nextHasNoMarginBottom
						label={ __( 'Answer', 'gutenblocks' ) }
						id={ `gtb-quiz-answer-${ questionIndex }-${ answerIndex }` }
					>
						<div className="gtb-quiz__answer-row">
							<TextControl
								__nextHasNoMarginBottom
								value={ answer }
								onChange={ ( value ) =>
									onUpdateAnswer(
										questionIndex,
										answerIndex,
										value
									)
								}
							/>
							{ question.answers.length > 1 && (
								<Button
									className="gtb-quiz__remove-answer"
									isDestructive
									onClick={ () =>
										onRemoveAnswer(
											questionIndex,
											answerIndex
										)
									}
								>
									<Icon icon={ close } />
								</Button>
							) }
						</div>
					</BaseControl>
				) ) }

				<Button
					variant="secondary"
					className="gtb-quiz__add-answer"
					onClick={ () => onAddAnswer( questionIndex ) }
				>
					{ __( 'Add Answer', 'gutenblocks' ) }
				</Button>
			</div>

			<RadioControl
				label={ __( 'Correct Answer', 'gutenblocks' ) }
				selected={ correctAnswer }
				options={ question.answers.map( ( answer ) => ( {
					label: answer || __( '(empty)', 'gutenblocks' ),
					value: answer,
				} ) ) }
				onChange={ ( value ) =>
					onSetCorrectAnswer( questionIndex, value )
				}
			/>
		</div>

		<Button
			variant="secondary"
			isDestructive
			className="gtb-quiz__remove-question"
			onClick={ () => onRemoveQuestion( questionIndex ) }
		>
			<Icon icon={ close } />
		</Button>
	</div>
);
