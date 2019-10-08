// @flow

export type ActionType = string;

export type ActionTypeMap = {
  [ActionType]: ActionType,
};

export type ErrorsState = {
  +[?ActionType]: ?string,
};

export type RequestsState = {
  +[?ActionType]: ?boolean,
};

export type Types = ActionType | ActionType[];
