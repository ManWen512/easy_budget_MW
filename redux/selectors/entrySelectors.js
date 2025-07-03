import { createSelector } from 'reselect';

const selectEntry = (state) => state.entry;

export const selectStatus = createSelector([selectEntry], (s) => s.status);
export const selectError = createSelector([selectEntry], (s) => s.error);
export const selectSuccessMessage = createSelector([selectEntry], (s) => s.successMessage); 