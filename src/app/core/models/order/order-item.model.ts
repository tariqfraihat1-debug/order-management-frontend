export interface OrderItem {
  itemId: number;
  itemName: string;
  itemNameAlternate?: string | null;
  quantity: number;
  price: number;
}