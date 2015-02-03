'use strict';
/*jshint globalstrict: true*/
/*global
    console,
    Rx,
    TextCalc
*/

var rot13 = function (text) {
    var rot13Encrypt = function (s) {
        if (s.toLowerCase() < 'a' || s.toLowerCase() > 'z') {
            return ' ';
        } else {
            return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13));
        }
    };
    return (text === undefined) ? "" : text.split("").map(rot13Encrypt).join("");
};

var sourceInput = document.querySelector('#source');
var encryptedDiv = document.querySelector('#encrypted');
var sumOfCharValuesDiv = document.querySelector('#sumOfCharValues');
var sumOfDigitsDiv = document.querySelector('#sumOfDigits');
var reducedToOneDigitDiv = document.querySelector('#reducedToOneDigit');

// ---
// map keyup event to input text
// ---
var inputStream = Rx.Observable.fromEvent(sourceInput, 'keyup');
var inputTextStream = inputStream
    .map(function (e) {
        return e.target.value;
    });

// ---
// calculation streams
// ---
var rot13Stream = inputTextStream
    .map(rot13);

var sumOfCharValuesStream = inputTextStream
    .map(TextCalc.sumOfCharValues);

var sumOfDigitsStream = sumOfCharValuesStream
    .map(TextCalc.sumOfDigits);

var reducedToOneDigitStream = sumOfDigitsStream
    .map(TextCalc.reduceToOneDigit);

// ---
// output to DOM
// ---
rot13Stream
    .subscribe(function (v) {
        encryptedDiv.innerHTML = v;
    });

sumOfCharValuesStream
    .subscribe(function (v) {
        sumOfCharValuesDiv.innerHTML = v;
    });

sumOfDigitsStream
    .subscribe(function (v) {
        sumOfDigitsDiv.innerHTML = v;
    });

reducedToOneDigitStream
    .subscribe(function (v) {
        reducedToOneDigitDiv.innerHTML = v;
    });
