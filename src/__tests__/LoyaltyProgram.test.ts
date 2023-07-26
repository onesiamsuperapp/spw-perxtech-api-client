import {
  ShortPerxLoyalty,
  PerxPointBalance,
  PerxLoyaltyTier,
  PerxLoyaltyAgingPoint,
  // PerxLoyaltyPointsHistory,
  // PerxLoyalty,
} from '../models';
import { Serialize, Deserialize } from 'cerialize';

describe('ShortPerxLoyalty', () => {
  test('should have correct default values', () => {
    const shortPerxLoyalty = new ShortPerxLoyalty();
    expect(Serialize(shortPerxLoyalty)).toEqual({});
  });

  test('should have correct instance', () => {
    const shortPerxLoyaltyData = {
      aggregated_points: null,
      date: null,
    };
    const shortPerxLoyalty: ShortPerxLoyalty = Deserialize(
      shortPerxLoyaltyData,
      ShortPerxLoyalty
    );
    expect(shortPerxLoyalty).toBeInstanceOf(ShortPerxLoyalty);
  });
});

describe('PerxPointBalance', () => {
  test('should have correct default values', () => {
    const perxPointBalance = new PerxPointBalance();
    expect(Serialize(perxPointBalance)).toEqual({});
  });

  test('should have correct instance', () => {
    const perxPointBalanceData = {
      aggregated_points: null,
      date: null,
    };
    const perxPointBalance: PerxPointBalance = Deserialize(
      perxPointBalanceData,
      PerxPointBalance
    );
    expect(perxPointBalance).toBeInstanceOf(PerxPointBalance);
  });
});

describe('PerxLoyaltyTier', () => {
  test('should have correct default values', () => {
    const perxLoyaltyTier = new PerxLoyaltyTier();
    expect(Serialize(perxLoyaltyTier)).toEqual({});
  });

  test('should have correct instance', () => {
    const perxLoyaltyTierData = {
      aggregated_points: null,
      date: null,
    };
    const perxLoyaltyTier: PerxLoyaltyTier = Deserialize(
      perxLoyaltyTierData,
      PerxLoyaltyTier
    );
    expect(perxLoyaltyTier).toBeInstanceOf(PerxLoyaltyTier);
  });
});

describe('PerxLoyaltyAgingPoint', () => {
  test('should have correct default values', () => {
    const perxLoyaltyAgingPoint = new PerxLoyaltyAgingPoint();
    expect(Serialize(perxLoyaltyAgingPoint)).toEqual({});
  });

  test('should have correct instance', () => {
    const perxLoyaltyAgingPointData = {
      aggregated_points: null,
      date: null,
    };
    const perxLoyaltyAgingPoint: PerxLoyaltyAgingPoint = Deserialize(
      perxLoyaltyAgingPointData,
      PerxLoyaltyAgingPoint
    );
    expect(perxLoyaltyAgingPoint).toBeInstanceOf(PerxLoyaltyAgingPoint);
  });
});
