import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "@wordpress/interactivity":
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/quiz/view.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/**
 * WordPress dependencies
 */


// Quiz functionality
const {
  state
} = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gutenblocks/quiz', {
  actions: {
    resetQuiz: () => {
      const dilogElement = document.querySelector('.gtb-quiz__status-dialog');
      state.answered = 0;
      state.correct = 0;
      state.allCorrect = false;

      // Reset all radio inputs
      const allInputs = document.querySelectorAll('.gtb-quiz__answer-input');
      allInputs.forEach(input => {
        input.checked = false;
      });

      // Close dialog if open
      if (dilogElement && dilogElement.open) {
        dilogElement.close();
      }
    },
    checkAnswers: () => {
      const {
        questions
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const checkedInputs = document.querySelectorAll('.gtb-quiz__answer-input:checked');
      const dilogElement = document.querySelector('.gtb-quiz__status-dialog');
      const answerMap = new Map(Array.from(checkedInputs).map(input => [parseInt(input.name.split('_')[1], 10), input.value]));

      // Reset previous results before checking
      state.answered = 0;
      state.correct = 0;

      // Calculate correct answers
      questions.forEach((question, index) => {
        const userAnswer = answerMap.get(index);
        if (userAnswer) {
          state.answered++;
          if (userAnswer === question.answers[state.list[index]]) {
            state.correct++;
          }
        }
      });

      // Update necessary state
      state.allCorrect = state.answered === questions.length && state.correct === questions.length;
      dilogElement.showModal();
    },
    modalClose: () => {
      const dilogElement = document.querySelector('.gtb-quiz__status-dialog');

      // Reset all quiz state and inputs
      state.answered = 0;
      state.correct = 0;
      state.allCorrect = false;

      // Reset all radio inputs
      const allInputs = document.querySelectorAll('.gtb-quiz__answer-input');
      allInputs.forEach(input => {
        input.checked = false;
      });

      // Close the dialog
      dilogElement.close();
    }
  }
});
})();


//# sourceMappingURL=view.js.map