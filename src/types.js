// @flow

import type { Action } from 'redux';

export type ActionType = string;

export type ActionTypeMap = {
  [ActionType]: ActionType,
};

export type ErrorAction = Action<ActionType> & {
  error: Error,
};

export type ErrorsState = {
  +[?ActionType]: ?string,
};

export type RequestsState = {
  +[?ActionType]: ?boolean,
};

export type Types = ActionType | ActionType[];
