/**
 * WordPress dependencies
 */
import {
	BaseControl,
	Button,
	Icon,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plus, pin } from '@wordpress/icons';

export const QuizSelect = ( {
	id,
	quizzes,
	isLoading,
	onQuizSelect,
	onCreateNew,
} ) => {
	if ( isLoading ) {
		return (
			<div className="gtb-quiz-edit__select-loading">
				<Spinner />
				{ __( 'Loading quizzes', 'gutenblocks' ) }
			</div>
		);
	}

	return (
		<div className="gtb-quiz-edit__select">
			<h4 className="gtb-quiz-edit__info-title">
				<Icon icon={ pin } />
				{ __( 'Select a quiz', 'gutenblocks' ) }
			</h4>
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				value={ id }
				onChange={ ( value ) => onQuizSelect( parseInt( value, 10 ) ) }
				options={ [
					{ label: __( 'Select a quiz', 'gutenblocks' ), value: 0 },
					...quizzes.map( ( quiz ) => ( {
						label: quiz.title.rendered,
						value: quiz.id,
					} ) ),
				] }
			/>

			{ id === 0 && (
				<BaseControl
					className="gtb-quiz-edit__create-button"
					__nextHasNoMarginBottom
					label={ __( 'Or Create New Quiz', 'gutenblocks' ) }
					id="gtb-quiz-create-button"
				>
					<Button variant="primary" onClick={ onCreateNew }>
						<Icon icon={ plus } />
						{ __( 'Create Quiz', 'gutenblocks' ) }
					</Button>
				</BaseControl>
			) }
		</div>
	);
};
