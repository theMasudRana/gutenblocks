/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

// Get the quiz data
const { state } = store( 'gutenblocks/quizcpt', {
	actions: {
		checkAnswers: async () => {
			const response = await fetch(
				`${ state.site_url }/wp-json/gutenblocks/v1/quizzes/${ state.id }`
			);
			const data = await response.json();

			console.log( data );
		},
	},
} );
