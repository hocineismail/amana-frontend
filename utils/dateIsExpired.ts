import { Console } from "console";

type Type = {
  date: string
}

export function dateIsExpired({ date }: Type) {
  let currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + 1)  
 if (currentDate < new Date()) return true
 return false
}
