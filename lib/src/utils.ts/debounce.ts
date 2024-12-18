// Debounce is for delaying a callback

// Debounce leading for avoiding multiple clicks
// function debounce(func , timeout = 1000) {
//   let timer: ReturnType<typeof setTimeout> | undefined;
//   return (...args) => {
//     if (!timer) {
//       func.apply(this, args);
//     }
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       timer = undefined;
//     }, timeout);
//   };
// }

const debounce = (func, delay = 1000) => {
	let debounceTimer;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => func.apply(context, args), delay);
	};
};

export default debounce;
