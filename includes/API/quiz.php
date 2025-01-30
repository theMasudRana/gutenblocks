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
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_quizzes' ),
					'permission_callback' => array( $this, 'get_quizzes_permission_check' ),
					'args'                => $this->get_collection_params(),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_quiz' ),
					'permission_callback' => array( $this, 'create_quiz_permission_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
				),
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

		// Get the quizzes.
		$query     = new \WP_Query( $args );
		$total     = $query->found_posts;
		$max_pages = ceil( $total / $per_page );
		$quizzes   = $query->get_posts();

		// Add headers.
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

	/**
	 * Create quiz permission check
	 *
	 * @since 1.0.0
	 */
	public function create_quiz_permission_check() {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Prepare the quiz for the response
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_Post         $item    The quiz object.
	 * @param \WP_REST_Request $request Request object.
	 *
	 * @return array
	 */
	public function prepare_item_for_response( $item, $request ) {
		// Get questions and answers from meta
		$questions       = json_decode( get_post_meta( $item->ID, 'quiz_questions', true ), true ) ?? array();
		$correct_answers = json_decode( get_post_meta( $item->ID, 'quiz_correct_answers', true ), true ) ?? array();

		// Format questions for display
		$formatted_questions = array();
		foreach ( $questions as $index => $question ) {
			$formatted_questions[] = sprintf(
				"%d. %s\n%s",
				$index + 1,
				$question['question'],
				implode(
					"\n",
					array_map(
						function ( $option ) {
							return '* ' . $option;
						},
						$question['options']
					)
				)
			);
		}

		$data = array(
			'id'              => $item->ID,
			'title'           => $item->post_title,
			'content'         => $item->post_content,
			'status'          => $item->post_status,
			'questions'       => $formatted_questions,
			'correct_answers' => $correct_answers,
		);

		return $data;
	}

	/**
	 * Get the collection parameters
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return array(
			'page'     => array(
				'description'       => 'Current page of the collection.',
				'type'              => 'integer',
				'default'           => 1,
				'sanitize_callback' => 'absint',
			),
			'per_page' => array(
				'description'       => 'Maximum number of items to be returned in result set.',
				'type'              => 'integer',
				'default'           => 10,
				'sanitize_callback' => 'absint',
			),
		);
	}

	/**
	 * Create a quiz
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return array|\WP_Error
	 */
	public function create_quiz( $request ) {
		// Get the title and content
		$title   = $request->get_param( 'title' ) ?? '';
		$content = $request->get_param( 'content' ) ?? '';

		// Get questions and answers from request
		$questions       = $request->get_param( 'questions' ) ?? array();
		$correct_answers = $request->get_param( 'correct_answers' ) ?? array();

		// Check if the title is empty
		if ( empty( $title ) ) {
			return new WP_Error(
				'rest_quiz_title_empty',
				__( 'Please provide a title for the quiz.', 'gutenblocks' ),
				array( 'status' => 400 )
			);
		}

		// Validate questions and answers
		if ( empty( $questions ) ) {
			return new WP_Error(
				'rest_quiz_questions_empty',
				__( 'Please provide at least one question.', 'gutenblocks' ),
				array( 'status' => 400 )
			);
		}

		if ( count( $questions ) !== count( $correct_answers ) ) {
			return new WP_Error(
				'rest_quiz_answers_mismatch',
				__( 'Number of correct answers must match number of questions.', 'gutenblocks' ),
				array( 'status' => 400 )
			);
		}

		// Create the quiz
		$quiz_id = wp_insert_post(
			array(
				'post_title'   => $title,
				'post_content' => $content,
				'post_status'  => 'publish',
				'post_type'    => 'quiz',
			)
		);

		// Check if the quiz was created
		if ( is_wp_error( $quiz_id ) ) {
			return $quiz_id;
		}

		// Format and store questions
		$formatted_questions = array();
		foreach ( $questions as $index => $question ) {
			$formatted_questions[] = array(
				'question' => sanitize_text_field( $question['text'] ),
				'options'  => array_map( 'sanitize_text_field', $question['options'] ),
			);
		}

		// Store questions and correct answers as meta
		update_post_meta( $quiz_id, 'quiz_questions', wp_json_encode( $formatted_questions ) );
		update_post_meta( $quiz_id, 'quiz_correct_answers', wp_json_encode( array_map( 'sanitize_text_field', $correct_answers ) ) );

		// Get the quiz
		$quiz = get_post( $quiz_id );

		// Return the formatted response
		return $this->prepare_item_for_response( $quiz, $request );
	}
}
