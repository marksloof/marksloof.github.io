'use strict';

/* TextCalc class */

var TextCalc = {};
TextCalc.sumOfCharValues = function (text, type) {
    var sum = 0,
        charValueA = "a".charCodeAt(0);
	(text + '').replace(/[a-z]/gi, function (s) {
		var charValue = s.toLowerCase().charCodeAt(0) - charValueA + 1;
		if (type === 'phone') {
			if (charValue <= 3) { // abc = 2
				sum += 2;
			} else if (charValue <= 6) { // def = 3
				sum += 3;
			} else if (charValue <= 9) { // ghi = 4
				sum += 4;
			} else if (charValue <= 12) { // jkl = 5
				sum += 5;
			} else if (charValue <= 15) { // mno = 6
				sum += 6;
			} else if (charValue <= 19) { // pqrs = 7
				sum += 7;
			} else if (charValue <= 22) { // tuv = 8
				sum += 8;
			} else { // wxyz = 9
				sum += 9;
			}
		} else if (type === 'reverse') {
			sum += 27 - charValue;
		} else {
			sum += s.toLowerCase().charCodeAt(0) - charValueA + 1;
		}
	});
	return sum;
};
TextCalc.sumOfDigits = function (number) {
	var sum = 0;
	while (number > 0) {
		sum += (number % 10);
		number = Math.floor(number / 10);
	}
	return sum;
};
TextCalc.reduceToOneDigit = function (number) {
	var result = TextCalc.sumOfDigits(number);
	while (result >= 10) {
		result = TextCalc.sumOfDigits(result);
	}
	return result;
};
