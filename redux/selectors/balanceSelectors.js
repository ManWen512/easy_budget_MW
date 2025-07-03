import { createSelector } from 'reselect';

const selectBalance = (state) => state.balance;

export const selectAccounts = createSelector([selectBalance], (s) => s.accounts);
export const selectTotalBalance = createSelector([selectBalance], (s) => s.totalBalance);
export const selectStatus = createSelector([selectBalance], (s) => s.status);
export const selectError = createSelector([selectBalance], (s) => s.error); 