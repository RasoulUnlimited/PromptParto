import { formatTimeAgo } from '../js/utils/history.js';

describe('formatTimeAgo', () => {
  test('returns minutes ago in Farsi', () => {
    const date = new Date(Date.now() - 2 * 60 * 1000);
    expect(formatTimeAgo(date)).toBe('2 دقیقه پیش');
  });

  test('returns seconds ago in Farsi', () => {
    const date = new Date(Date.now() - 1 * 1000);
    expect(formatTimeAgo(date)).toBe('1 ثانیه پیش');
  });
});