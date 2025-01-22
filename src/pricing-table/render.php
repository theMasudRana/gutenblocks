<?php
/**
 * Display the pricing table block on the frontend.
 */

if ( empty( $attributes ) ) {
	return;
}

// Extract the attributes into variables
$pricing_title    = $attributes['title'] ?? '';
$pricing_subtitle = $attributes['subtitle'] ?? '';
$currency         = $attributes['currency'] ?? '$';
$price            = $attributes['price'] ?? '';
$price_separator  = $attributes['priceSeparator'] ?? '/';
$price_period     = $attributes['pricePeriod'] ?? '';
$features         = $attributes['features'] ?? [];
$button_text      = $attributes['buttonText'] ?? '';
$button_url       = $attributes['buttonUrl'] ?? '#';
$on_sale          = $attributes['onSale'] ?? false;
$sale_price       = $attributes['salePrice'] ?? '';
$is_featured      = $attributes['featured'] ?? false;

?>
<div
	<?php echo get_block_wrapper_attributes(); ?>
>
	<div class="gtb-pricing">
		<?php if ( $is_featured ) : ?>
			<div class="gtb-pricing__featured">
				<?php esc_html_e( 'Featured', 'gutenblocks' ); ?>
			</div>
		<?php endif; ?>
		<div class="pricing-table__header">
			<h3 class="gtb-pricing__title"><?php echo esc_html( $pricing_title ); ?></h3>
			<p class="gtb-pricing__subtitle"><?php echo esc_html( $pricing_subtitle ); ?></p>
		</div>
		<div class="gtb-pricing__price-wrapper">
			<?php if ( $on_sale && $sale_price ) : ?>
				<span class="tb-pricing__price">
					<del>
						<?php echo esc_html( $currency ); ?>
						<?php echo esc_html( $price ); ?>
					</del>
					<?php echo esc_html( $currency ); ?>
					<?php echo esc_html( $sale_price ); ?>
				</span>
			<?php else : ?>
				<span class="gtb-pricing__price">
					<?php echo esc_html( $currency ); ?>
					<?php echo esc_html( $price ); ?>
				</span>
			<?php endif; ?>

			<span class="pricing-table__period">
				<?php echo esc_html( $price_separator . $price_period ); ?>
			</span>
		</div>
		<?php if ( ! empty( $features ) ) : ?>
			<ul class="gtb-pricing__features">
				<?php foreach ( $features as $feature ) : ?>
					<li class="pricing-table__feature">
						<?php echo esc_html( $feature['text'] ); ?>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
		<div class="gtb-pricing__button">
			<a
				href="<?php echo esc_url( $button_url ); ?>"
				class="gtb-pricing__button-link"
			>
				<?php echo esc_html( $button_text ); ?>
			</a>
		</div>
	</div>
</div>
