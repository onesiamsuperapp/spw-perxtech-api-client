import { PerxBaseInvoiceItem, PerxInvoice } from '../models';
import { Serialize, Deserialize } from 'cerialize';

describe('PerxBaseInvoiceItem', () => {
  test('should have correct default values', () => {
    const perxBaseInvoiceItem = new PerxBaseInvoiceItem();
    expect(Serialize(perxBaseInvoiceItem)).toEqual({});
  });

  test('should have correct instance', () => {
    const customer = {
      item_id: 123,
      item_type: 'Reward::Transaction',
    };
    const perxBaseInvoiceItem: PerxBaseInvoiceItem = Deserialize(
      customer,
      PerxBaseInvoiceItem
    );
    expect(perxBaseInvoiceItem).toBeInstanceOf(PerxBaseInvoiceItem);
  });
});

describe('PerxInvoice', () => {
  test('should have correct default values', () => {
    const perxBaseInvoiceItem = new PerxInvoice();
    expect(Serialize(perxBaseInvoiceItem)).toEqual({
      description: null,
      invoice_items: [],
    });
  });

  test('should have correct instance', () => {
    const perxInvoiceData = {
      description: null,
      invoice_items: [],
    };
    const perxInvoice: PerxInvoice = Deserialize(perxInvoiceData, PerxInvoice);
    expect(perxInvoice).toBeInstanceOf(PerxInvoice);
  });
});
