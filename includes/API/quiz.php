<?php

namespace Gutenblocks\API;

use WP_Error;
use WP_REST_Controller;
use WP_REST_Server;

/**
 * Quiz API
 *
 * @since 1.0.0
 */
class Quiz extends WP_REST_Controller {
	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->namespace = 'gutenblocks/v1';
		$this->rest_base = 'quizzes';
	}

	/**
	 * Register the routes for the quiz
	 *
	 * @since 1.0.0
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_quizzes' ),
				'permission_callback' => array( $this, 'get_quizzes_permission_check' ),
				'args'                => $this->get_collection_params(),
			)
		);
	}

	/**
	 * Get the quizzes
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return array|\WP_Error
	 */
	public function get_quizzes( $request ) {
		$page     = $request->get_param( 'page' ) ? (int) $request->get_param( 'page' ) : 1;
		$per_page = $request->get_param( 'per_page' ) ? (int) $request->get_param( 'per_page' ) : 10;

		$args = array(
			'post_type'      => 'quiz',
			'posts_per_page' => $per_page,
			'paged'          => $page,
			'post_status'    => 'publish',
		);

		// Get the quizzes
		$query     = new \WP_Query( $args );
		$total     = $query->found_posts;
		$max_pages = ceil( $total / $per_page );
		$quizzes   = $query->get_posts();

		// Add headers
		$response = new \WP_REST_Response( $quizzes );
		$response->header( 'X-WP-Total', $total );
		$response->header( 'X-WP-TotalPages', $max_pages );

		return $response;
	}

	/**
	 * Check if has permission to create a quiz
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function get_quizzes_permission_check() {
		return current_user_can( 'manage_options' );
	}
}
