<?php
/**
 * The blocks class
 *
 * @since 1.0.0
 *
 * @package Gutenblocks
 */

namespace Gutenblocks;

class Blocks {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'gutenberg_blocks_init' ) );
	}

	/**
	 * List of all the blocks
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_block_names() {
		return array(
			'posts-grid',
		);
	}

	/**
	 * Register all the blocks
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function gutenberg_blocks_init() {
		foreach ( $this->get_block_names() as $block_name ) {
			register_block_type( GUTENBLOCKS_PATH . '/build/' . $block_name );
		}
	}
}
