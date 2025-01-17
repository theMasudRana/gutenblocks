<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

	$posts_per_page = (int) $attributes['numberOfPosts'];
	$posts          = get_posts(
		array(
			'post_type'      => 'post',
			'posts_per_page' => $posts_per_page,
		)
	);
	?>
<div class="gtb-posts-grid" <?php echo get_block_wrapper_attributes(); ?>>
	<?php if ( ! empty( $posts ) ) : ?>
		<ul class="gtb-posts-grid__list">
			<?php foreach ( $posts as $post ) : ?>
				<li class="gtb-posts-grid__item">
					<a href="<?php echo esc_url( get_permalink( $post->ID ) ); ?>">
						<?php echo esc_html( get_the_title( $post->ID ) ); ?>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php else : ?>
		<p><?php esc_html_e( 'No posts found.', 'gutenblocks' ); ?></p>
	<?php endif; ?>
</div>
