export enum MenuStatus {
  Deleted = "DELETED"
}

export enum MenuAvailability {
  Available = "AVAILABLE",
  SoldOut = "SOLD_OUT",
  Unavailable = "UNAVAILABLE"
}

export interface IMenu {
  _id: string;
  name: string;
  description:string;
  price:number;
  imageUrl: string;
  category: string;
  ingredients?: string[];
  quantity?: number;
  availability?: string;  
  ratingAverage?: number;
  totalRating?: number;
  status?: string // "DELETED";
  prepareTime?: number; // in minutes
  calories?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export enum DeleteMenuStatus {
  Completed,
  NotFound,
  Error
}

export enum UpdateMenuStatus {
  NotFound,
  Error
}

export interface AddMenuDto { 
  name: string;
  description: string;
  price: number;
  imageUri: string;
  category: string;
  ingredients?: string[];
  prepareTime?: number;
  calories?: number;
  quantity?: number;
}

export interface UpdateMenuDto {      
  name?: string;      
  description?: string;    
  price?: number;      
  imageUri?: string;      
  category?: string;    
  availability?: MenuAvailability;    
  ratingAverage?: number;    
  totalRating?: number;  
  ingredients?: string[];  
  prepareTime?: number;
  calories?: number;
  quantity?: number;
}