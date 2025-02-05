<?php
/**
 * API class
 *
 * @package Gutenblocks
 *
 * @since 1.0.0
 */

namespace Gutenblocks;

use Gutenblocks\API\Quiz;

/**
 * API class
 *
 * @since 1.0.0
 */
class API {
	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_api' ) );
	}

	/**
	 * Register the API routes
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_api() {
		$quiz = new Quiz();
		$quiz->register_routes();
	}
}
