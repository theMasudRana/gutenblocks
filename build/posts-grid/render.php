<?php
/**
 * Displays the Posts Grid block on the frontend.
 * 
 * @package Gutenblocks\PostsGrid
 * 
 * @since 1.0.0
 */

// Destructure and sanitize attributes
$number_of_posts        = absint( $attributes['numberOfPosts'] ?? 6 );
$number_of_columns      = absint( $attributes['numberOfColumns'] ?? 3 );
$display_excerpt        = (bool) $attributes['displayExcerpt'] ?? true;
$post_excerpt_length    = absint( $attributes['excerptLength'] ?? 16 );
$display_post_thumbnail = (bool) $attributes['displayFeaturedImage'] ?? true;
$align                  = sanitize_text_field( $attributes['align'] ?? 'center' );
$order                  = sanitize_text_field( $attributes['order'] ?? 'desc' );

// Query posts based on attributes
$query = new WP_Query( [
	'post_type'              => 'post',
	'posts_per_page'         => $number_of_posts,
	'order'                  => $order,
	'ignore_sticky_posts'    => true,
	'no_found_rows'          => true,
	'update_post_meta_cache' => false,
	'update_post_term_cache' => false,
] );

$posts = $query->posts;

// Build classes for the block
$classes = [
	'gtb-posts-grid',
	'gtb-posts-grid--columns-' . $number_of_columns,
	'align' . $align,
];
$combined_classes = implode(' ', array_map( 'sanitize_html_class', $classes ) );

// Update post excerpt length
add_filter( 'excerpt_length', function() use ( $post_excerpt_length ) {
	return $post_excerpt_length;
} );

?>
<div class="<?php echo esc_attr( $combined_classes ); ?>" <?php echo get_block_wrapper_attributes(); ?>>
	<?php if ( ! empty( $posts ) ) : ?>
		<?php foreach ( $posts as $post ) : ?>
			<article class="gtb-posts-grid__item">
				<?php if ( $display_post_thumbnail && has_post_thumbnail( $post->ID ) ) : ?>
					<a href="<?php echo esc_url( get_permalink( $post->ID ) ); ?>" class="gtb-posts-grid__image-wrapper">
						<?php echo get_the_post_thumbnail( $post->ID, 'medium', array( 'class' => 'gtb-posts-grid__image' ) ); ?>
					</a>
				<?php endif; ?>
				<div class="gtb-posts-grid__content">
					<h3 class="gtb-posts-grid__title">
						<a href="<?php echo esc_url( get_permalink( $post->ID ) ); ?>">
							<?php echo esc_html( get_the_title( $post->ID ) ); ?>
						</a>
					</h3>
					<?php if( $display_excerpt ) : ?>
						<div class="gtb-posts-grid__excerpt">
							<p><?php echo esc_html( get_the_excerpt( $post->ID ) ); ?></p>
						</div>
					<?php endif; ?>
					<div class="gtb-posts-grid__meta">
						<span class="gtb-posts-grid__post-date">
							<?php echo esc_html( get_the_date( '', $post->ID ) ); ?>
						</span>
						<a href="<?php echo esc_url( get_permalink( $post->ID ) ); ?>" class="gtb-posts-grid__read-more">
							<?php esc_html_e( 'Read more', 'gutenblocks' ); ?>
						</a>
					</div>
				</div>
			</article>
		<?php endforeach; ?>
	<?php else : ?>
		<p><?php esc_html_e( 'No posts found.', 'gutenblocks' ); ?></p>
	<?php endif; ?>
	<?php wp_reset_postdata(); ?>
</div>
