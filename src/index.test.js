import {
  clearErrors,
  genActionTypes,
  getBaseType,
  getErrorType,
  getSuccessType,
  isBaseType,
  isComplete,
  isErrorType,
  isPending,
  isUninitiated,
  errorsReducer,
  requestsReducer,
} from '.';

const BASE_TYPE = 'BASE_TYPE';
const ERROR_TYPE = 'BASE_TYPE_ERROR';
const SUCCESS_TYPE = 'BASE_TYPE_SUCCESS';

const TYPES = genActionTypes([BASE_TYPE]);

const uninitiated = {};
const pending = { [BASE_TYPE]: true };
const completed = { [BASE_TYPE]: false };

describe('actionTypes utils', () => {
  test('returns the base action type', () => {
    expect(getBaseType(ERROR_TYPE)).toBe(BASE_TYPE);
    expect(getBaseType(SUCCESS_TYPE)).toBe(BASE_TYPE);
    expect(getBaseType(BASE_TYPE)).toBe(BASE_TYPE);
  });

  test('returns the error type', () => {
    expect(getErrorType(BASE_TYPE)).toBe(ERROR_TYPE);
  });

  test('returns the success type', () => {
    expect(getSuccessType(BASE_TYPE)).toBe(SUCCESS_TYPE);
  });

  test('determines whether a type is a base type', () => {
    expect(isBaseType(BASE_TYPE)).toBe(true);
    expect(isBaseType(ERROR_TYPE)).toBe(false);
    expect(isBaseType(SUCCESS_TYPE)).toBe(false);
  });

  test('determines whether a type is an error type', () => {
    expect(isErrorType(BASE_TYPE)).toBe(false);
    expect(isErrorType(ERROR_TYPE)).toBe(true);
    expect(isErrorType(SUCCESS_TYPE)).toBe(false);
  });

  test('determines whether a request is uninitiated', () => {
    expect(isUninitiated(pending, BASE_TYPE)).toBe(false);
    expect(isUninitiated(completed, BASE_TYPE)).toBe(false);
    expect(isUninitiated(uninitiated, BASE_TYPE)).toBe(true);
  });

  test('determines whether a request is complete', () => {
    expect(isComplete(uninitiated, BASE_TYPE)).toBe(false);
    expect(isComplete(pending, BASE_TYPE)).toBe(false);
    expect(isComplete(completed, BASE_TYPE)).toBe(true);
  });

  test('determines whether a request is pending', () => {
    expect(isPending(uninitiated, BASE_TYPE)).toBe(false);
    expect(isPending(completed, BASE_TYPE)).toBe(false);
    expect(isPending(pending, BASE_TYPE)).toBe(true);
  });

  test('generates success and error types for an array of base types', () => {
    expect(TYPES).toEqual({
      [BASE_TYPE]: BASE_TYPE,
      [ERROR_TYPE]: ERROR_TYPE,
      [SUCCESS_TYPE]: SUCCESS_TYPE,
    });
  });

  test(
    '`genActionTypes` throws an error when it does not recieve an array',
    () => {
      const willThrow = () => genActionTypes(BASE_TYPE);
      expect(willThrow).toThrow();
    }
  );

  test(
    '`clearErrors` throws an error when it receives non-string keys',
    () => {
      const willThrow = () => clearErrors(['FOO', 'BAR']);
      expect(willThrow).toThrow();
    }
  );
});

describe('errorsReducer', () => {
  let reducer;
  let state;

  beforeEach(() => {
    reducer = errorsReducer(genActionTypes([
      'TYPE_ONE',
      'TYPE_TWO',
      'TYPE_THREE',
    ]));

    state = {
      TYPE_ONE: { message: 'This is error one.' },
      TYPE_TWO: { message: 'This is error two.' },
    };
  });

  test('clears specified errors', () => {
    const action = {
      keys: ['TYPE_ONE'],
      type: 'CLEAR_ERRORS',
    };
    expect(reducer(state, action)).toEqual({
      TYPE_TWO: { message: 'This is error two.' },
    });
  });

  test('clears all errors', () => {
    const action = { type: 'CLEAR_ERRORS' };
    expect(reducer(state, action)).toEqual({});
  });

  test(
    'returns the existing state if the action type is not whitelisted',
    () => {
      expect(reducer(state, { type: 'FOO_ERROR' })).toEqual(state);
    }
  );

  test(
    'returns the existing state if the action type is not an error',
    () => {
      expect(reducer(state, { type: 'TYPE_ONE' })).toEqual(state);
    }
  );

  test('updates the state with a new error', () => {
    const action = {
      error: { message: 'This is error three.' },
      type: 'TYPE_THREE_ERROR',
    };

    expect(reducer(state, action)).toEqual({
      ...state,
      TYPE_THREE: action.error,
    });
  });

  test('defaults `types` and `state` to an empty object', () => {
    reducer = errorsReducer();
    expect(reducer(undefined, { type: 'FOO' })).toEqual({});
  });
});

describe('requestsReducer', () => {
  let reducer;

  beforeEach(() => {
    reducer = requestsReducer(TYPES);
  });

  test('returns the existing state', () => {
    expect(reducer(pending, { type: 'FOO' })).toEqual(pending);
  });

  test('updates the request state', () => {
    expect(reducer({}, { type: BASE_TYPE })).toEqual(pending);
    expect(reducer({}, { type: ERROR_TYPE })).toEqual(completed);
  });

  test('defaults `types` and `state` to an empty object', () => {
    reducer = requestsReducer();
    expect(reducer(undefined, { type: 'FOO' })).toEqual({});
  });
});
