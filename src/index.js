// @flow

import type { Action, Dispatch, Reducer } from 'redux';
import type { ActionType, ActionTypeMap, ErrorAction, ErrorsState, RequestsState, Types } from './types';

/**
 * Constants/ActionTypes
 */
const CLEAR_ERRORS = 'CLEAR_ERRORS';


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

export function isComplete(requests: RequestsState, types: Types): boolean {
  const requestTypes = typeof types === 'string' ? [types] : types;
  return requestTypes.every((type) => !requests[type]);
}

export function isPending(requests: RequestsState, types: Types): boolean {
  return !isComplete(requests, types);
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
export function clearErrors() {
  return (dispatch: Dispatch<Action<ActionType>>): void => {
    dispatch({
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
      return {};
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
