/**
 * Returns random integer number within 1 to max.
 * @param {number} max
 * @returns {number} random number
 */

const getRandomInt = max => {
	let min = 1;
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default getRandomInt;
