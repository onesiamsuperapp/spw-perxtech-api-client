import { autoserializeAs, inheritSerialization } from 'cerialize'

export class PerxTaxonomy {

  @autoserializeAs('id')
  id!: number

  @autoserializeAs('title')
  title: string = ''

  @autoserializeAs('name')
  name?: string

  @autoserializeAs('description')
  description?: string

  @autoserializeAs('title_en')
  titleEn: string | null = null

  @autoserializeAs('title_th')
  titleTh: string | null = null

  @autoserializeAs('parent')
  parent: PerxTaxonomy | null = null

  @autoserializeAs('usage')
  usage: string[] = []
}

@inheritSerialization(PerxTaxonomy)
export class PerxCategory { }

@inheritSerialization(PerxTaxonomy)
export class PerxTag { }