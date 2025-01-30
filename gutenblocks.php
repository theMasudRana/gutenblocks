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
 * Domain Path:       /languages
 *
 * @package Gutenblocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

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
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		add_action( 'plugins_loaded', array( $this, 'init_plugin' ) );
		add_action( 'init', array( $this, 'gutenblock_blocks_init' ) );
		add_action( 'init', array( $this, 'gutenblock_load_textdomain' ) );
		add_filter( 'block_categories_all', array( $this, 'gutenblock_block_category' ), 10, 2 );
		add_action( 'init', array( $this, 'register_quiz_post_type' ) );
		add_action( 'save_post', array( $this, 'create_quiz_from_save_post' ), 10, 3 );
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
		} else {
			new Gutenblocks\Frontend();
		}

		new Gutenblocks\API();
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
			'quiz',
			'testimonial',
			'pricing-table',
			'quizcpt',
		);
	}

	/**
	 * Register all the blocks
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function gutenblock_blocks_init() {
		foreach ( $this->get_block_names() as $block_name ) {
			register_block_type( GUTENBLOCKS_PATH . '/build/' . $block_name );
		}
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

	/**
	 * Load plugin textdomain
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function gutenblock_load_textdomain() {
		load_plugin_textdomain(
			'gutenblocks',
			false,
			dirname( plugin_basename( __FILE__ ) ) . '/languages'
		);
	}

	/**
	 * Adding a custom block category
	 *
	 * @param array $block_categories       Array of categories for block types.
	 *
	 * @return array
	 *
	 * @since 1.0.0
	 */
	public function gutenblock_block_category( $block_categories ) {
		return array_merge(
			$block_categories,
			array(
				array(
					'slug'  => 'gutenblocks-category',
					'title' => esc_html__( 'Gutenblocks', 'gutenblocks' ),
				),
			)
		);
	}

	/**
	 * Register quiz post type
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_quiz_post_type() {
		register_post_type(
			'quiz',
			array(
				'labels'       => array(
					'name'          => __( 'Quizzes', 'gutenblocks' ),
					'singular_name' => __( 'Quiz', 'gutenblocks' ),
					'add_new_item'  => __( 'Add New Quiz', 'gutenblocks' ),
				),
				'public'       => true,
				'has_archive'  => true,
				'show_in_rest' => true,
			)
		);
	}

	/**
	 * Create quiz from save post
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post    Post object.
	 * @param bool    $update  Whether this is an existing post being updated or not.
	 *
	 * @return void
	 *
	 * @since 1.0.0
	 */
	public function create_quiz_from_save_post( $post_id, $post, $update ) {
		// Avoid infinite loop from autosave
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Only proceed if this is a page being saved
		if ( 'page' !== $post->post_type ) {
			return;
		}

		// Get the content and check if it contains blocks
		$content = $post->post_content;
		if ( ! has_blocks( $content ) ) {
			return;
		}

		// Parse blocks
		$blocks = parse_blocks( $content );

		foreach ( $blocks as $block ) {
			if ( isset( $block['blockName'] ) && $block['blockName'] === 'gutenblocks/quizcpt' ) {
				$heading = isset( $block['attrs']['quizTitle'] ) ? sanitize_text_field( $block['attrs']['quizTitle'] ) : '';

				// Only create post if heading is not empty
				if ( ! empty( $heading ) ) {
					// Check if a post with this title already exists
					$existing_posts = new WP_Query(
						array(
							'post_type'      => 'post',
							'post_status'    => 'publish',
							'title'          => $heading,
							'posts_per_page' => 1,
							'fields'         => 'ids', // Optimize query performance
						)
					);

					if ( ! $existing_posts->have_posts() ) {
						// Prepare post data
						$post_id = wp_insert_post(
							array(
								'post_title'  => $heading,
								'post_status' => 'publish',
								'post_type'   => 'post',
								'post_author' => get_current_user_id(),
							)
						);

						// Extract quiz questions, options, and correct answers
						$quiz_questions  = isset( $block['attrs']['questions'] ) ? $block['attrs']['questions'] : array();
						$correct_answers = isset( $block['attrs']['correctAnswers'] ) ? $block['attrs']['correctAnswers'] : array();

						if ( ! empty( $quiz_questions ) ) {
							// Format quiz data
							$quiz_data = array();
							foreach ( $quiz_questions as $question ) {
								$formatted_question = array(
									'question' => sanitize_text_field( $question['question'] ?? '' ),
									'options'  => array_map( 'sanitize_text_field', $question['options'] ?? array() ),
								);
								$quiz_data[]        = $formatted_question;
							}

							// Save questions and options as post meta
							update_post_meta( $post_id, '_quiz_data', $quiz_data );
						}

						// Save correct answers as post meta
						if ( ! empty( $correct_answers ) ) {
							update_post_meta( $post_id, '_quiz_correct_answers', array_map( 'sanitize_text_field', $correct_answers ) );
						}
					}
				}
			}
		}
	}
}

// kick-off the plugin.
Gutenblocks::init();
