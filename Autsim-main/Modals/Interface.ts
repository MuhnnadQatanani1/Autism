export interface UserData {
  UserId: string; // إضافة UserId
  Roles: string[];
  email: string;
  firstname: string;
  lastname: string;
  status: number;
}

export interface Card {
    id: number;
    name: string;
    iFormFile: string
  }
  
   export interface ResponseData {
    totalCount: number;
    cards: Card[];
  }