<?php
/**
 * The admin menu handler class
 *
 * @since 1.0.0
 *
 * @package Gutenblocks
 */

namespace Gutenblocks\Admin;

class Menu {

	/**
	 * Initialize the class
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
	}

	/**
	 * Register the admin menu
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function admin_menu() {
		add_menu_page(
			__( 'Gutenblocks', 'gutenblocks' ),
			__( 'Gutenblocks', 'gutenblocks' ),
			'manage_options',
			'gutenblocks',
			array( $this, 'plugin_page' ),
			'dashicons-layout',
			20
		);
	}

	/**
	 * Render the plugin page
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function plugin_page() {
		echo '<div class="wrap">
		<h2>Gutenblocks</h2>
		</div>';
	}
}
