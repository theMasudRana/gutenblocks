import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Panel,
	PanelBody,
	PanelRow,
	RadioControl,
	TextControl,
	Icon,
	SelectControl,
	Spinner,
	BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { close, plus } from '@wordpress/icons';
import './editor.scss';
import useAfterSave from './utils';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
/**
 * Edit component for the Quiz block
 *
 * @param {Object} props - The component props
 * @param {Object} props.attributes - The block attributes
 * @param {Function} props.setAttributes - The function to update the block attributes
 * @returns {JSX.Element} The Edit component
 */
export default function Edit( { attributes, setAttributes } ) {
	const { id } = attributes;
	const [ quizData, setQuizData ] = useState( {
		title: '',
		questions: [],
		correctAnswers: [],
	} );
	const blockProps = useBlockProps();
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

	console.log( id );

	// Fetch quiz for specific ID
	const fetchQuizData = async ( quizId ) => {
		try {
			const response = await apiFetch( {
				path: `/gutenblocks/v1/quizzes/${ quizId }`,
			} );
			setQuizData( {
				title: response.title,
				questions: response.questions || [],
				correctAnswers: response.correct_answers || [],
			} );
		} catch ( error ) {
			console.error( 'Error fetching quiz data:', error );
		}
	};

	// Fetch quiz data when ID changes
	useEffect( () => {
		if ( id && 0 !== id ) {
			fetchQuizData( id );
		}
	}, [ id ] );

	return (
		<div { ...blockProps }>
			<div className="gtb-quiz">
				{ isLoading ? (
					<div className="gtb-quiz__select-loading">
						<Spinner />
						{ __( 'Loading quizzes...', 'gutenblocks' ) }
					</div>
				) : (
					<div className="gtb-quiz__select">
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom={ true }
							label="Select a quiz"
							value={ id }
							onChange={ ( value ) => {
								setAttributes( {
									id: parseInt( value, 10 ),
								} );
							} }
							options={ [
								{
									disabled: false,
									label: __( 'Select a quiz', 'gutenblocks' ),
									value: 0,
								},
								...quizzes.map( ( quiz ) => ( {
									label: quiz.title.rendered,
									value: quiz.id,
								} ) ),
							] }
						/>

						{ 0 === id && (
							<BaseControl
								className="gtb-quiz__create-button"
								__nextHasNoMarginBottom={ true }
								label={ __(
									'Or Create New Quiz',
									'gutenblocks'
								) }
							>
								<Button variant="primary">
									<Icon icon={ plus } />
									{ __( 'Create Quiz', 'gutenblocks' ) }
								</Button>
							</BaseControl>
						) }
					</div>
				) }
			</div>
		</div>
	);
}
