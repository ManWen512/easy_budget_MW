import { createSelector } from 'reselect';

const selectHome = (state) => state.home;

export const selectTotalBalance = createSelector([selectHome], (home) => home.totalBalance);
export const selectIncomeList = createSelector([selectHome], (home) => home.incomeList);
export const selectOutcomeList = createSelector([selectHome], (home) => home.outcomeList);
export const selectIncomeCategoryList = createSelector([selectHome], (home) => home.incomeCategoryList);
export const selectOutcomeCategoryList = createSelector([selectHome], (home) => home.outcomeCategoryList);
export const selectIncomeCategoryCostList = createSelector([selectHome], (home) => home.incomeCategoryCostList);
export const selectOutcomeCategoryCostList = createSelector([selectHome], (home) => home.outcomeCategoryCostList);
export const selectStatus = createSelector([selectHome], (home) => home.status);
export const selectError = createSelector([selectHome], (home) => home.error); 