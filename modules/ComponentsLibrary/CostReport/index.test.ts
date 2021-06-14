import { GetTotalTransactions } from '.';

describe('CostReport', () => {
  it.only('Calculates the right values for transactions', () => {
    const results = GetTotalTransactions([]);

    expect(results).toBe(0);
  });
});
