<?php
/**
 * Quiz Block Renderer
 *
 * Renders a quiz block with questions and multiple-choice answers.
 *
 * @package Gutenblocks
 *
 * @param array     $attributes Block attributes.
 */

// Validate quiz ID
$quiz_id = $attributes['id'] ?? 0;

if ( ! $quiz_id ) {
    return;
}

// Fetch quiz data
$quiz      = get_post( $quiz_id );
$quiz_data = json_decode( get_post_meta( $quiz_id, 'quiz_questions', true ), true );

if ( empty( $quiz_data ) ) {
    return;
}
// Interactivity state for the quiz
wp_interactivity_state(
    'gutenblocks/quiz',
    array(
        'answered'          => 0,
        'correct'           => 0,
        'allCorrect'        => false,
        'site_url'          => get_site_url(),
        'quiz_id'           => $quiz_id,
        'modal_title'       => __( 'Quiz Results', 'gutenblocks' ),
        'all_correct_title' => __( '🥳 All correct, congratulations!', 'gutenblocks' ),
    )
);

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'gtb-quiz' ] );
$total_questions = count( $quiz_data );
?>

<div 
    <?php echo wp_kses_data( $wrapper_attributes ); ?>
    data-wp-interactive="gutenblocks/quiz"
>
    <h2 class="gtb-quiz__title">
        <?php echo esc_html( $quiz->post_title ); ?>
    </h2>
    
    <div class="gtb-quiz__wrapper">
        <?php foreach ( $quiz_data as $index => $question ) : ?>
            <div class="gtb-quiz__question">
                <h3 class="gtb-quiz__question-title">
                    <?php printf(
                        '%d. %s',
                        esc_html( $index + 1 ),
                        esc_html( $question['question'] )
                    ); ?>
                </h3>
                
                <div class="gtb-quiz__answers">
                    <?php foreach ( $question['answers'] as $answer ) : 
                    ?>
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
            </div>
        <?php endforeach; ?>
        
        <button 
            data-wp-on--click="actions.checkAnswers"
            class="gtb-quiz__action-button"
        >
            <?php esc_html_e( 'Submit Quiz', 'gutenblocks' ); ?>
        </button>


        <dialog 
            class="gtb-quiz__status-dialog"
            data-wp-bind--open="state.showDialog"
        >
            <div class="gtb-quiz__status">
                <p 
                    class="gtb-quiz__status-title"
                    data-wp-text="state.modal_title"
                ></p>

                <p class="gtb-quiz__answered">
                    <?php printf(
                        /* translators: %1$s is the number of attempted questions, %2$d is the total number of questions */
                        esc_html__( '🎯 Questions Attempted: %1$s out of %2$d', 'gutenblocks' ),
                        '<span class="gtb-quiz__correct" data-wp-text="state.answered"></span>',
                        $total_questions
                    ); ?>
                </p>
                <p class="gtb-quiz__score">
                    <?php printf(
                        /* translators: %1$s is the number of correct answers, %2$d is the total number of questions */
                        esc_html__( '✨ Your Score: %1$s correct answers from %2$d questions!', 'gutenblocks' ),
                        '<span class="gtb-quiz__correct" data-wp-text="state.correct"></span>',
                        $total_questions
                    ); ?>
                </p>
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
