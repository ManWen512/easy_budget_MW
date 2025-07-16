import { createSelector } from 'reselect';

const selectAiChat = (state) => state.aiChat;

export const selectNewChat = createSelector([selectAiChat], (s)=> s.newChat);
export const selectHistory = createSelector([selectAiChat], (s)=> s.history);
export const selectStatus = createSelector([selectAiChat], (s) => s.status);
export const selectError = createSelector([selectAiChat], (s) => s.error);