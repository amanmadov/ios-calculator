/*

    Touro University GST MSIN 625 Midterm
    by: Nury Amanmadov

*/

//#region DOM Elements 

const outputLabel = document.querySelector('.item.calculatorDisplay');
const numberButtons = document.querySelectorAll('.btn.num');
const clearButton = document.querySelector('.btn.silver.clear');
const negateButton = document.querySelector('.btn.silver.negative');
const equalsButton = document.querySelector('.btn.equals');
const decimalButton = document.querySelector('.btn.decimal');
const actionButtons = document.querySelectorAll('.btn.action.orange');

//#endregion

// initial variables state
let activeOperation = null;
let previousOperation = null;
let currentLabelNumber;
let previousLabelNumber;
let isMultiDigitNumber = false;

//#region Helper Functions 

const resetVariables = () => {
    activeOperation = null;
    previousOperation = null;
    isMultiDigitNumber = false;
}

const setOutputLabel = (number) => outputLabel.innerHTML = number.toString();

const getOutputLabel = () => outputLabel.innerHTML;

//#endregion

//#region Negate and Clear Functions 

const clearOutputLabel = () => {
    setOutputLabel(0);
    resetVariables();
};

const negateOutputLabel = () => outputLabel.innerHTML !== '0' && (outputLabel.innerHTML = (Number(outputLabel.innerHTML) * -1).toString());

//#endregion

//#region Operator Functions 

const add = (num1, num2) => Number(num1) + Number(num2);
const subtract = (num1, num2) => Number(num1) - Number(num2);
const multiply = (num1, num2) => Number(num1) * Number(num2);
const divide = (num1, num2) => Number(num1) / Number(num2);
const getRemainder = (num1, num2) => Number(num1) % Number(num2);

//#endregion

// Calculate Function
const calculate = (operator, number1, number2) => {

    let result = 0;

    // Guard clauses
    if (operator === '+') result = add(number1, number2);
    if (operator === '-') result = subtract(number1, number2);
    if (operator === 'x') result = multiply(number1, number2);
    if (operator === '÷') result = divide(number1, number2);
    if (operator === '%') result = getRemainder(number1, number2);

    // JavaScript uses IEEE 754 double precision floating-point numbers (see ECMA-262) and they cannot accurately represent all decimal fractions
    // To solve this issue: https://stackoverflow.com/questions/44949148/node-giving-strange-output-on-sum-of-particular-float-digits/44949594#44949594
    result = Math.round(100 * result) / 100;

    setOutputLabel(result);
    previousLabelNumber = result;
}

const numberClickHandler = (e) => {

    let clickedNumber = e.target.innerHTML;
    let currentLabel = getOutputLabel();

    // to avoid multiple click of '.' character 
    if(currentLabel.includes('.') && clickedNumber === '.') return;

    if (activeOperation === null) {
        currentLabel !== '0' ? currentLabel += clickedNumber : (clickedNumber === '.' ? currentLabel += clickedNumber : currentLabel = clickedNumber);
        setOutputLabel(currentLabel);
        return;
    }

    // if second operand is single digit
    if(!isMultiDigitNumber){
        currentLabel = clickedNumber;
        isMultiDigitNumber = true;
        setOutputLabel(currentLabel);
        return;
    }

    currentLabel += clickedNumber;
    setOutputLabel(currentLabel);
}

const actionClickHandler = (e) => {

    clickedOperation = e.target.innerHTML;
    isMultiDigitNumber = false;

    // do nothing if user clicks operator button before any number 
    if (activeOperation === null && currentLabelNumber === null) return;

    // user clicks number and then for the first time user clicks for any operator button
    if (activeOperation === null) {
        activeOperation = clickedOperation;
        previousOperation = clickedOperation;
        previousLabelNumber = Number(getOutputLabel());
        return;
    }

    currentLabelNumber = Number(getOutputLabel());

    // user clicks number and then user clicks for any operator button for the second or more time
    if (previousOperation === clickedOperation) {
        activeOperation = clickedOperation;
        previousOperation = clickedOperation;
        calculate(clickedOperation, previousLabelNumber, currentLabelNumber);
    } else {
        calculate(previousOperation, previousLabelNumber, currentLabelNumber);
        activeOperation = clickedOperation;
        previousOperation = clickedOperation;
    }

}

const equalsClickHandler = () => {
    calculate(activeOperation, previousLabelNumber, Number(getOutputLabel()));
    resetVariables();
}

//#region EventListeners 

// attaches eventhandler for click event of all number buttons
numberButtons.forEach(btn => btn.addEventListener('click', numberClickHandler));

// attaches eventhandler for click event of all operation buttons
actionButtons.forEach(btn => btn.addEventListener('click', actionClickHandler));

// attaches eventhandler for AC button
clearButton.addEventListener('click', clearOutputLabel);

// attaches eventhandler for +/- button
negateButton.addEventListener('click', negateOutputLabel);

// attaches eventhandler for = button
equalsButton.addEventListener('click', equalsClickHandler);

// attaches eventhandler for . button
decimalButton.addEventListener('click', numberClickHandler);

//#endregion


