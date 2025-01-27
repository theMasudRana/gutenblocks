<?php
/**
 * Displays the Quiz block on the frontend.
 * 
 * @package Gutenblocks\Quiz
 * 
 * @since 1.0.0
 */

// Return if there are no questions
if ( empty( $attributes['questions'] ) ) {
	return;
}

// Set context with questions
$context = array(
	'questions' => $attributes['questions'] ?? [],
);

// Interactivity state for the quiz
wp_interactivity_state(
	'gutenblocks/quiz',
	array(
		'answered'   => 0,
		'correct'    => 0,
		'allCorrect' => false,
		'list'       => $attributes['correctAnswers'] ?? [],
	)
);

?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="gutenblocks/quiz"
	<?php echo wp_interactivity_data_wp_context( $context ); ?>
	class="gtb-quiz">
	<div class="gtb-quiz__wrapper">
		<?php foreach ( $attributes['questions'] as $index => $questionData) : 
			$questionNumber = $index + 1;
		?>
			<div class="gtb-quiz__question">
				<h4 class="gtb-quiz__question-title">
					<?php echo esc_html( $questionNumber ); ?>. <?php echo esc_html( $questionData['question'] ); ?>
				</h4>
				<?php foreach ( $questionData['answers'] as $answer ) : ?>
					<div class="gtb-quiz__answer">
						<input 
							class="gtb-quiz__answer-input"
							type="radio" 
							name="question_<?php echo esc_attr( $index ); ?>" 
							value="<?php echo esc_attr( $answer ); ?>"
							id="<?php echo esc_attr( $answer . $index ); ?>">
						<label
							class="gtb-quiz__answer-label"
							for="<?php echo esc_attr( $answer . $index ); ?>"
						>
							<?php echo esc_html( $answer ); ?>
						</label>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endforeach; ?>

		<button
			data-wp-on--click="actions.checkAnswers"
			class="gtb-quiz__action-button"
		>
			<?php esc_html_e( 'Check Answers', 'gutenblocks' ); ?>
		</button>

		<!-- Dialog for quiz status -->
		<dialog 
			class="gtb-quiz__status-dialog"
			data-wp-bind--open="state.showDialog"
		>
			<div class="gtb-quiz__status">
				<p class="gtb-quiz__answered">
					<?php esc_html_e( 'Answered:', 'gutenblocks' ); ?>
					<span 
						class="gtb-quiz__correct"
						data-wp-text="state.answered"
					></span> / 
					<span class="gtb-quiz__total">
						<?php echo count( $attributes['questions'] ); ?>
					</span>
				</p>
				<p class="gtb-quiz__score">
					<?php esc_html_e( 'Score:', 'gutenblocks' ); ?>
					<span 
						class="gtb-quiz__correct"
						data-wp-text="state.correct"
					></span> / 
					<span class="gtb-quiz__total">
						<?php echo count( $attributes['questions'] ); ?>
					</span>
				</p>
				<div data-wp-bind--hidden="!state.allCorrect">
					<?php esc_html_e( 'All correct, congratulations!', 'gutenblocks' ); ?>
				</div>
				<button 
					class="gtb-quiz__action-button"
					data-wp-on--click="actions.modalClose"
				>
					<?php esc_html_e( 'Close', 'gutenblocks' ); ?>
				</button>
			</div>
		</dialog>
	</div>
</div>