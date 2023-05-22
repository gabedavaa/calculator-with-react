import React, { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./style.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-opereation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVELUATE: "eveluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overWright) {
        return {
          ...state,
          currentOperand: payload.digit,
          overWright: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOprerand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOprerand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOprerand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOprerand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVELUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOprerand == null
      ) {
        return state;
      }
      return {
        ...state,
        overWright: true,
        previousOprerand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overWright) {
        return { ...state, overWright: false, currentOperand: null };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return { ...state, currentOperand: state.currentOperand.slice(0, -1) };
    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOprerand, operation }) {
  const prev = parseFloat(previousOprerand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATER.format(integer);
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOprerand, operation }, dispatch] =
    useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOprerand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        className="span-two"
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        onClick={() => dispatch({ type: ACTIONS.EVELUATE })}
        className="span-two"
      >
        =
      </button>
    </div>
  );
}

export default App;
