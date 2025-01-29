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
				'callback'            => array( $this, 'get_quiz' ),
				'permission_callback' => array( $this, 'get_quizzes_permission_check' ),
				'args'                => $this->get_collection_params(),
			)
		);
	}

	/**
	 * Get the quiz
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return array|\WP_Error
	 */
	public function get_quiz( $request ) {

		$args = array();

		$params = $this->get_collection_params();

		foreach ( $params as $key => $value ) {
			if ( isset( $request[ $key ] ) ) {
				$args[ $key ] = $request[ $key ];
			}
		}

		// TODO: Implement the query to get the quiz.

		$quiz = get_posts(
			array(
				'post_type'   => 'quiz',
				'numberposts' => -1,
			)
		);

		if ( empty( $quiz ) ) {
			return new WP_Error( 'no_quiz', 'There are no quiz available', array( 'status' => 404 ) );
		}

		return $quiz;
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
