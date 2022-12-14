import { BARIDIMOB, CARDLESS, CCP, DELIVERY, MONEY_ORDER, IN_OFFICE } from "../constants/constants";

export function checkAvailablityTransaction (method: string, wallet: number, amountEuro: number,
     amountDz: number) {
 
 
 
    if (wallet < amountEuro) {
        return true
    }
    if (method === CCP) {
        if (amountDz < 1000) {
            return true
        } 
    } else  if (method === MONEY_ORDER) {
        if (amountDz < 1000 || amountDz > 200000) {
            return true
        }    
    } else  if (method === BARIDIMOB) {
        if (amountDz < 1000 || amountDz > 100000) {
            return true
        }    
    } else  if (method === DELIVERY) {
        if (amountDz < 20000) {
            return true
        }    
    }  else  if (method === CARDLESS) {
        if (amountDz < 2000 || amountDz > 100000) {
            return true
        }   
    } else if (method ===  IN_OFFICE ) {
        if (amountDz < 1000|| amountDz > 200000) {
            return true
        } 
    } else {
        return false
    }

  
}