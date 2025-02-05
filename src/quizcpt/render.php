<?php
/**
 * Displays the Quiz block on the frontend.
 * 
 * @package Gutenblocks\Quiz
 * 
 * @since 1.0.0
 */

// Return if there are no questions
if ( empty( $attributes['id'] ) ) {
	return;
}

// Get the quiz data
$quiz = get_post( $attributes['id'] );


// Interactivity state for the quiz
wp_interactivity_state(
	'gutenblocks/quizcpt',
	array(
		'id' => $attributes['id'],
		'site_url' => site_url(),
	)
);

?>
<div 
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="gutenblocks/quizcpt"
>
	<h1>Hi</h1>
	<button 
		data-wp-on--click="actions.checkAnswers"
		class="gtb-quizcpt__check-answers">
		<?php esc_html_e( 'Check Answers', 'gutenblocks' ); ?>
	</button>
</div>
