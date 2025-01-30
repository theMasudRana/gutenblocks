import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { quizTitle, quizQuestions, correctAnswers } = attributes;
	const blockProps = useBlockProps();

	// Update quiz title
	const updateQuizTitle = ( value ) => {
		setAttributes( { quizTitle: value } );
	};

	// Add a new question
	const addQuestion = () => {
		setAttributes( {
			quizQuestions: [
				...quizQuestions,
				{
					question: '',
					options: [ 'Option A', 'Option B', 'Option C' ],
				},
			],
			correctAnswers: [ ...correctAnswers, '' ],
		} );
	};

	// Update a question
	const updateQuestion = ( index, value ) => {
		const updatedQuestions = [ ...quizQuestions ];
		updatedQuestions[ index ].question = value;
		setAttributes( { quizQuestions: updatedQuestions } );
	};

	// Update an option
	const updateOption = ( qIndex, oIndex, value ) => {
		const updatedQuestions = [ ...quizQuestions ];
		updatedQuestions[ qIndex ].options[ oIndex ] = value;
		setAttributes( { quizQuestions: updatedQuestions } );
	};

	// Update correct answer
	const updateCorrectAnswer = ( index, value ) => {
		const updatedCorrectAnswers = [ ...correctAnswers ];
		updatedCorrectAnswers[ index ] = value;
		setAttributes( { correctAnswers: updatedCorrectAnswers } );
	};

	// Remove a question
	const removeQuestion = ( index ) => {
		const updatedQuestions = [ ...quizQuestions ];
		const updatedCorrectAnswers = [ ...correctAnswers ];
		updatedQuestions.splice( index, 1 );
		updatedCorrectAnswers.splice( index, 1 );
		setAttributes( {
			quizQuestions: updatedQuestions,
			correctAnswers: updatedCorrectAnswers,
		} );
	};

	return (
		<div { ...blockProps }>
			<TextControl
				label={ __( 'Quiz Title', 'gutenblocks' ) }
				value={ quizTitle }
				__nextHasNoMarginBottom={ true }
				onChange={ updateQuizTitle }
			/>

			<h4>{ __( 'Quiz Questions', 'gutenblocks' ) }</h4>
			{ quizQuestions.map( ( q, qIndex ) => (
				<div key={ qIndex } className="quiz-question">
					<TextControl
						label={ __( 'Question:', 'gutenblocks' ) }
						value={ q.question }
						__nextHasNoMarginBottom={ true }
						onChange={ ( value ) =>
							updateQuestion( qIndex, value )
						}
					/>

					{ q.options.map( ( option, oIndex ) => (
						<TextControl
							key={ oIndex }
							label={ `${ __( 'Option', 'gutenblocks' ) } ${
								oIndex + 1
							}` }
							value={ option }
							__nextHasNoMarginBottom={ true }
							onChange={ ( value ) =>
								updateOption( qIndex, oIndex, value )
							}
						/>
					) ) }

					<TextControl
						label={ __( 'Correct Answer:', 'gutenblocks' ) }
						value={ correctAnswers[ qIndex ] || '' }
						__nextHasNoMarginBottom={ true }
						onChange={ ( value ) =>
							updateCorrectAnswer( qIndex, value )
						}
					/>

					<Button
						isDestructive
						onClick={ () => removeQuestion( qIndex ) }
					>
						{ __( 'Remove Question', 'gutenblocks' ) }
					</Button>
				</div>
			) ) }

			<Button variant='primary' onClick={ addQuestion }>
				{ __( 'Add Question', 'gutenblocks' ) }
			</Button>
		</div>
	);
}
