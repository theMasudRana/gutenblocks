<?php
/**
 * Plugin Name:       Gutenblocks
 * Description:       A collection of custom Gutenberg blocks.
 * Plugin URI:        https://masudrana.me
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Masud Rana
 * Author URI:        https://masudrana.me
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gutenblocks
 * Domain Path:       languages
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/vendor/autoload.php';

// Check if the class exists before running it.
if ( ! class_exists( 'Gutenblocks' ) ) {
	/**
	 * The main plugin class
	 *
	 * @since 1.0.0
	 */
	final class Gutenblocks {

		/**
		 * Plugin version
		 *
		 * @var string
		 */
		const VERSION = '1.0.0';

		/**
		 * Class constructor
		 */
		private function __construct() {
			$this->define_constants();
			$this->init_blocks();
			register_activation_hook( __FILE__, array( $this, 'activate' ) );
			add_action( 'init', array( $this, 'init_plugin' ) );
		}

		/**
		 * Initialize a singleton instance
		 *
		 * @since 1.0.0
		 *
		 * @return \Gutenblocks
		 */
		public static function init() {
			static $instance = false;

			if ( ! $instance ) {
				$instance = new self();
			}

			return $instance;
		}

		/**
		 * Define the required plugin constants
		 *
		 * @since 1.0.0
		 *
		 * @return void
		 */
		private function define_constants() {
			define( 'GUTENBLOCKS_VERSION', self::VERSION );
			define( 'GUTENBLOCKS_FILE', __FILE__ );
			define( 'GUTENBLOCKS_PATH', __DIR__ );
			define( 'GUTENBLOCKS_URL', plugins_url( '', GUTENBLOCKS_FILE ) );
			define( 'GUTENBLOCKS_ASSETS', GUTENBLOCKS_URL . '/assets' );
		}

		/**
		 * Initialize the plugin
		 *
		 * @since 1.0.0
		 *
		 * @return void
		 */
		public function init_plugin() {

			if ( is_admin() ) {
				new Gutenblocks\Admin();
			}
		}

		/**
		 * Initialize the blocks
		 *
		 * @since 1.0.0
		 *
		 * @return void
		 */
		public function init_blocks() {
			new Gutenblocks\Blocks();
		}

		/**
		 * Do stuff upon plugin activation
		 *
		 * @since 1.0.0
		 *
		 * @return void
		 */
		public function activate() {
			$installed = get_option( 'gutenblocks_installed' );

			if ( ! $installed ) {
				update_option( 'gutenblocks_installed', time() );
			}

			update_option( 'gutenblocks_version', GUTENBLOCKS_VERSION );
		}
	}
}

if ( ! function_exists( 'gutenblocks' ) ) {

	/**
	 * Returns the main instance of the plugin
	 *
	 * @since 1.0.0
	 *
	 * @return \Gutenblocks
	 */
	function gutenblocks() {
		return Gutenblocks::init();
	}
}

// kick-off the plugin.
gutenblocks();
