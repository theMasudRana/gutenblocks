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
import { plus } from '@wordpress/icons';

export const QuizSelect = ( {
	id,
	quizzes,
	isLoading,
	onQuizSelect,
	onCreateNew,
} ) => {
	if ( isLoading ) {
		return (
			<div className="gtb-quiz__select-loading">
				<Spinner />
				{ __( 'Loading quizzes', 'gutenblocks' ) }
			</div>
		);
	}

	return (
		<div className="gtb-quiz__select">
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Select a quiz', 'gutenblocks' ) }
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
					className="gtb-quiz__create-button"
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
