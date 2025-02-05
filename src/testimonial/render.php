<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Block attributes
$testimonials   = $attributes[ 'testimonials' ] ?? [];

// Return if there are no testimonials
if ( empty( $testimonials ) ) {
    return;
}

// Slider context 
$context = array(
    'transform'    => 'translateX(0%)',
    'itemsPerView' => absint( $attributes['slidePerView'] ),
    'totalSlides'  => count( $testimonials),
    'currentIndex' => 0,
);

// Styles for the block
$style = sprintf(
    '--items-per-view: %d;',
    $context['itemsPerView'],
);
?>

<div
    <?php echo get_block_wrapper_attributes(); ?>
    data-wp-interactive="gutenblocks/testimonials"
    <?php echo wp_interactivity_data_wp_context( $context ); ?>
    style="<?php echo esc_attr( $style ); ?>"
>
    <div class="gtb-testimonial__navigation">
        <button
            data-wp-on--click="actions.previousSlide"
            aria-label="<?php echo esc_attr( 'Previous Slide', 'gutenblocks' ); ?>"
            class="gtb-testimonial__navigation--prev"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>

        <button
            data-wp-on--click="actions.nextSlide"
            aria-label="<?php echo esc_attr( 'Next Slide', 'gutenblocks' ); ?>"
            class="gtb-testimonial__navigation--next"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </button>
    </div>

    <div class="gtb-testimonial">
        <div 
            class="gtb-testimonial__slider"
            data-wp-style--transform="context.transform"
        >
            <?php
                foreach ( $testimonials as $testimonial ) :
                    ?>
                    <div class="gtb-testimonial__slide">
                        <div class="gtb-testimonial__content">
                            <div class="profile-image-container">
                                <?php if( ! empty( $testimonial['profileImage'] ) ) : ?>
                                    <img
                                        src="<?php echo esc_url( $testimonial['profileImage'] ); ?>"
                                        alt="<?php echo esc_attr( $testimonial['author'] ); ?>"
                                        class="gtb-testimonial__profile-image"
                                    />
                                <?php else : ?>
                                    <div class="gtb-testimonial__button-large">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="120" height="120" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div class="gtb-testimonial__header">
                                <h3 class="gtb-testimonial__author-name">
                                    <?php echo esc_html( $testimonial['author'] ); ?>
                                </h3>
                                <p class="gtb-testimonial__designation">
                                    <?php echo esc_html( $testimonial['designation'] ); ?>
                                </p>
                            </div>
                            <h4 class="gtb-testimonial__review-title">
                                <?php echo esc_html( $testimonial['reviewTitle'] ); ?>
                            </h4>
                            <?php
                            $rating       = absint( $testimonial['rating'] );
                            $rating_value = sprintf( '--gtb-rating: %d', $rating );
                            ?>
                            <span class="gtb-testimonial__rating-stars" style="<?php echo esc_attr( $rating_value ); ?>"></span>
                            <p class="gtb-testimonial__review-text">
                                <?php echo wp_kses_post( $testimonial['reviewText'] ); ?>
                            </p>
                        </div>
                    </div>
                    <?php
                endforeach;
            ?>
        </div>
    </div>
</div>
