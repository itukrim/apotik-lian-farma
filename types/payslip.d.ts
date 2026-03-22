declare interface Payslip {
  id: number,
  transaction_number: string,
  transaction_date: string,
  shopping_list: Item[],
  total: number
}
