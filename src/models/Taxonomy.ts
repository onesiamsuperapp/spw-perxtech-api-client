import { autoserializeAs, inheritSerialization } from 'cerialize'
import { ISODateTimeSerializer } from '../utils/cerialize'

export class PerxTaxonomy {

  @autoserializeAs('id')
  id!: number

  @autoserializeAs('title')
  title: string = ''

  @autoserializeAs('name')
  name?: string

  @autoserializeAs('description')
  description: string | null = null

  @autoserializeAs('title_en')
  titleEn: string | null = null

  @autoserializeAs('title_th')
  titleTh: string | null = null

  @autoserializeAs(PerxTaxonomy, 'parent')
  parent: PerxTaxonomy | null = null

  @autoserializeAs('usage')
  usage: string[] = []

  @autoserializeAs(ISODateTimeSerializer, 'created_at')
  createdAt!: Date

  @autoserializeAs(ISODateTimeSerializer, 'updated_at')
  updatedAt!: Date
}

@inheritSerialization(PerxTaxonomy)
export class PerxCategory extends PerxTaxonomy { }

@inheritSerialization(PerxTaxonomy)
export class PerxTag extends PerxTaxonomy { }