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
$quiz      = get_post( $attributes['id'] );
$quiz_meta = json_decode( get_post_meta( $attributes['id'], 'quiz_questions', true ), true );



// Interactivity state for the quiz
wp_interactivity_state(
	'gutenblocks/quizcpt',
	array(
		'id'       => $attributes['id'],
		'site_url' => site_url(),
	)
);

?>
<div 
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="gutenblocks/quizcpt"
>
	<div class="gtb-quiz">
		<h2><?php echo esc_html( $quiz->post_title ); ?></h2>
	</div>
	<button 
		data-wp-on--click="actions.checkAnswers"
		class="gtb-quizcpt__check-answers">
		<?php esc_html_e( 'Check Answers', 'gutenblocks' ); ?>
	</button>
</div>
