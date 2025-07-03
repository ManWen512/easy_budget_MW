import { createSelector } from 'reselect';

const selectGraph = (state) => state.graph;

export const selectIncomeCategoryList = createSelector([selectGraph], (s) => s.incomeCategoryList);
export const selectOutcomeCategoryList = createSelector([selectGraph], (s) => s.outcomeCategoryList);
export const selectIncomeList = createSelector([selectGraph], (s) => s.incomeList);
export const selectOutcomeList = createSelector([selectGraph], (s) => s.outcomeList);
export const selectIncomeCategoryCostList = createSelector([selectGraph], (s) => s.incomeCategoryCostList);
export const selectOutcomeCategoryCostList = createSelector([selectGraph], (s) => s.outcomeCategoryCostList);
export const selectStatus = createSelector([selectGraph], (s) => s.status);
export const selectError = createSelector([selectGraph], (s) => s.error); 