import { createSelector } from 'reselect';

const selectHistory = (state) => state.history;

export const selectAccountsData = createSelector([selectHistory], (s) => s.accountsData);
export const selectCategoriesData = createSelector([selectHistory], (s) => s.categoriesData);
export const selectEntryData = createSelector([selectHistory], (s) => s.entryData);
export const selectTotalCost = createSelector([selectHistory], (s) => s.totalCost);
export const selectStatus = createSelector([selectHistory], (s) => s.status);
export const selectError = createSelector([selectHistory], (s) => s.error);
export const selectFilters = createSelector([selectHistory], (s) => s.filters); 
