

export interface Cart {
  _id: string;
  tableId: string;
  userId: string;
  cartContents: CartContents[];
  orderType: OrderType,
  createdAt: string;
  updatedAt: string;
}

export type CartContents = {
  menuId: string;
  amount: number;
  updatedAt: string;
}

export enum OrderType {
  Solo = "SOLO",
  Group = "GROUP"
}

export interface GenerateCartDto {  
  userId: string;  
  tableId:string;  
  orderType: OrderType
}

export interface AddToCartDto {  
  menuId:string;
  amount: number
}