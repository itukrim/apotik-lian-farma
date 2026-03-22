declare interface Medicine {
  id?: number,
  code: string,
  name: string,
  unit: string,
  original_price: number | any,
  selling_price: number | any,
  stock: number | any,
  sold: number,
  created_at?: string,
  updated_at?: string,
}
