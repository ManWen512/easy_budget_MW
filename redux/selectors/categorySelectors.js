import { createSelector } from 'reselect';

const selectCategory = (state) => state.category;

export const selectCategories = createSelector([selectCategory], (s) => s.categories);
export const selectStatus = createSelector([selectCategory], (s) => s.status);
export const selectError = createSelector([selectCategory], (s) => s.error); 