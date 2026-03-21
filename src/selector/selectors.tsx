import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { PaymentsFieldData, PaymentsType } from '../constants/appConstant.ts';

export const selectFilteredQuotes = createSelector(
  [(state: RootState) => state.quote.quote as unknown as PaymentsType[], (_, optyId: string) => optyId],
  (quotes, optyId) => quotes.filter((quote) => quote[PaymentsFieldData.OptyId] === optyId)
  .sort((a, b) =>  new Date(b[PaymentsFieldData.Created]).getTime() - new Date(a[PaymentsFieldData.Created]).getTime())
);