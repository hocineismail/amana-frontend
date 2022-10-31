import { Alert } from "react-bootstrap";
import { ICurrency } from "../typings/types";

export function getCurrentcyFormat ({currency, amount}: ICurrency) {
 
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency, 
            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
          });
          return formatter.format(amount);
    

}

export function financial(x: number) {
 
  return parseFloat(Number(x.toString()).toFixed(2));
}