export const ISODateTimeSerializer = {
  // to JSON
  Serialize(raw: any): any {
    return raw instanceof Date ? raw.toISOString() : raw
  },
  // from JSON
  Deserialize(json: any): any {
    return new Date(json)
  }
}
