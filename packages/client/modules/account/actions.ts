export const SET_ACTIVE_ACCOUNT = 'SET_ACTIVE_ACCOUNT';

export interface SetActiveAccount {
  type: typeof SET_ACTIVE_ACCOUNT;
  payload: string | null;
}

export const createSetActiveAccount = (
  account: string | null
): SetActiveAccount => ({
  type: SET_ACTIVE_ACCOUNT,
  payload: account
});

export type Types = SetActiveAccount;
