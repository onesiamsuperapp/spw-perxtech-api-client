import { autoserializeAs, inheritSerialization } from 'cerialize'

export type PerxInvoiceItemType = 'Reward::Transaction' | 'StoredValue::Transaction'

export class PerxBaseInvoiceItem {

  @autoserializeAs('item_id')
  itemId!: number

  @autoserializeAs('item_type')
  itemType!: PerxInvoiceItemType
}

@inheritSerialization(PerxBaseInvoiceItem)
export class PerxInvoiceItem extends PerxBaseInvoiceItem {

  @autoserializeAs('id')
  id!: number
}

export class PerxInvoice {
  
  @autoserializeAs('id')
  id!: number

  @autoserializeAs('description')
  description: string | null = null

  @autoserializeAs(PerxInvoiceItem, 'invoice_items')
  invoiceItems: PerxInvoiceItem[] = []
}