import { PerxRewardSearchResult } from '../models';
import { Serialize, Deserialize } from 'cerialize';

describe('PerxRewardSearchResult', () => {
  test('should have correct default values', () => {
    const perxRewardSearchResult = new PerxRewardSearchResult();
    expect(Serialize(perxRewardSearchResult)).toEqual({ score: 0 });
  });

  test('should have correct instance', () => {
    const perxRewardSearchResultData = {
      points: 0,
      properties: {},
    };
    const perxRewardSearchResult: PerxRewardSearchResult = Deserialize(
      perxRewardSearchResultData,
      PerxRewardSearchResult
    );
    expect(perxRewardSearchResult).toBeInstanceOf(PerxRewardSearchResult);
  });
});
