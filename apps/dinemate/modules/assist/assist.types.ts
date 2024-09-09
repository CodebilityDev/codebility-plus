

export interface AssistDto {
  userId: string;
  userName: string;
  message: string;
  tableId: string;
  tableNumber: string;
}



export enum AssistStatus {
  Pending = "PENDING",
  Seen = "SEEN",
  Completed = "COMPLETED"
}

export interface Assist {
  userId: string;
  userName: string;
  message: string;
  tableId: string;
  tableNumber: string;
  status: AssistStatus
  createdAt: string;
  updatedAt: string;
  _id: string;
}