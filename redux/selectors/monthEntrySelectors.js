import { createSelector } from 'reselect';

const selectMonthEntry = (state) => state.monthEntry;

export const selectMonthEntries = createSelector([selectMonthEntry], (s) => s.monthEntries);
export const selectTotalIncome = createSelector([selectMonthEntry], (s) => s.totalIncome);
export const selectTotalOutcome = createSelector([selectMonthEntry], (s) => s.totalOutcome);
export const selectTotalBalance = createSelector([selectMonthEntry], (s) => s.totalBalance);
export const selectYear = createSelector([selectMonthEntry], (s) => s.year);
export const selectMonth = createSelector([selectMonthEntry], (s) => s.month);
export const selectStatus = createSelector([selectMonthEntry], (s) => s.status);
export const selectError = createSelector([selectMonthEntry], (s) => s.error);
export const selectSnackbarMessage = createSelector([selectMonthEntry], (s) => s.snackbarMessage);
export const selectShowSnackbar = createSelector([selectMonthEntry], (s) => s.showSnackbar); 