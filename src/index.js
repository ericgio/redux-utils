// @flow

import type { Action, Dispatch, Reducer } from 'redux';
import type { ActionType, ActionTypeMap, ErrorAction, ErrorsState, RequestsState, Types } from './types';

// TODO: Make this an enum?
type Status = boolean | typeof undefined;

/**
 * Constants/ActionTypes
 */
const CLEAR_ERRORS = 'CLEAR_ERRORS';

function checkStatus(
  requests: RequestsState,
  types: Types,
  status: Status
): boolean {
  const typeArr = typeof types === 'string' ? [types] : types;
  return typeArr.every((type) => requests[type] === status);
}

/**
 * Util Functions
 */
export function getBaseType(type: ActionType): ActionType {
  return type.replace('_ERROR', '').replace('_SUCCESS', '');
}

export function getErrorType(type: ActionType): ActionType {
  return `${type}_ERROR`;
}

export function getSuccessType(type: ActionType): ActionType {
  return `${type}_SUCCESS`;
}

export function isBaseType(type: ActionType): boolean {
  return type.indexOf('ERROR') === -1 && type.indexOf('SUCCESS') === -1;
}

export function isErrorType(type: ActionType): boolean {
  return type.indexOf('ERROR') > -1;
}

export function isUninitiated(requests: RequestsState, types: Types): boolean {
  return checkStatus(requests, types, undefined);
}

export function isComplete(requests: RequestsState, types: Types): boolean {
  return checkStatus(requests, types, false);
}

export function isPending(requests: RequestsState, types: Types): boolean {
  return checkStatus(requests, types, true);
}

function reduceActionTypes(
  obj: ActionTypeMap,
  type: ActionType
): ActionTypeMap {
  return {
    ...obj,
    [type]: type,
    [getErrorType(type)]: getErrorType(type),
    [getSuccessType(type)]: getSuccessType(type),
  };
}

export function genActionTypes(types: ActionType[]): ActionTypeMap {
  if (!Array.isArray(types)) {
    throw Error('The argument for `genActionTypes` must be an array.');
  }

  return types.reduce(reduceActionTypes, {});
}


/**
 * Action Creators
 */
export function clearErrors(...keys: mixed[]) {
  keys.forEach((key: mixed) => {
    if (typeof key !== 'string') {
      throw Error(
        `\`clearErrors\` expects string arguments, but received ${typeof key}.`
      );
    }
  });

  return (dispatch: Dispatch<Action<ActionType>>): void => {
    dispatch({
      keys,
      type: CLEAR_ERRORS,
    });
  };
}

/**
 * Reducers
 */
export function errorsReducer(
  types: ActionTypeMap = {}
): Reducer<ErrorsState, ErrorAction> {
  return (
    state: ErrorsState = {},
    action: ErrorAction
  ): ErrorsState => {
    const { error, type } = action;

    // Reset state.
    if (type === CLEAR_ERRORS) {
      // If no action types are specified, clear all the errors.
      if (!(action.keys && action.keys.length)) {
        return {};
      }

      // Otherwise, clear just the specified keys.
      const newState = { ...state };
      action.keys.forEach((key: string) => { delete newState[key]; });
      return newState;
    }

    // Ignore any actions that are not whitelisted or are not errors.
    if (!(types[type] && isErrorType(type))) {
      return state;
    }

    return {
      ...state,
      [getBaseType(type)]: error,
    };
  };
}

export function requestsReducer(
  types: ActionTypeMap = {}
): Reducer<RequestsState, Action<ActionType>> {
  return (
    state: RequestsState = {},
    action: Action<ActionType>
  ): RequestsState => {
    const { type } = action;

    // Filter out any actions that are not whitelisted.
    if (!types[type]) {
      return state;
    }

    if (isBaseType(type)) {
      return {
        ...state,
        [type]: true,
      };
    }

    return {
      ...state,
      [getBaseType(type)]: false,
    };
  };
}
