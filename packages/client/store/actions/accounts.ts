export const SET_ACTIVE_ACCOUNT = "SET_ACTIVE_ACCOUNT";

export interface SetActiveAccount {
  type: "SET_ACTIVE_ACCOUNT";
  payload: string;
}

export const createSetActiveAccount = (account: string) => ({
  type: SET_ACTIVE_ACCOUNT,
  payload: account
});

export type AccountTypes = SetActiveAccount;