<?php
/**
 * The admin class
 *
 * Handles all admin functionality and hooks
 *
 * @package Gutenblocks
 * @since 1.0.0
 */

namespace Gutenblocks;

class Admin {
	/**
	 * Initialize the class
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		new Admin\Menu();
	}
}
