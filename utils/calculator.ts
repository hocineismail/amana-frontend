import { financial } from "./getCurrencyFormat";

/**
   * Returns the Total euro amount with fees.
   *
   *
   * @param amount - Number - DZD currency
   * @param fees: array- Range of fees
   * @param exchange - Number - exchange from EURO to DZD
   * @returns get the EURO amount after applying fees and fees
   *
   * @beta
   */
interface IERUOFROMDINAR {
  amount: number;
  fees: any;
  exchange: number;
}
interface IGETFEES {
    amount: number;
    fees: any;
 
  }
export const getEuroFromDZD = ({ amount, fees, exchange }: IERUOFROMDINAR): any => {
  amount = amount / exchange;
  for (let i = 0; i < fees.length; i++) {
    if (fees[i].fees.type === "fix") {
      let euroWithFees = amount + financial(Number(fees[i].fees.fee));
      if (
        euroWithFees >= fees[i].fees.min_price &&
        euroWithFees <= fees[i].fees.max_price
      ) {
        return {
            fees: financial(Number(fees[i].fees.fee)),
            amountWithoutFees: amount,
            amount: financial(euroWithFees)
        }
      }
    } else {
      let restFees = 100 - Number(fees[i].fees.fee);
      let euroWithFees =
        amount + (Number(fees[i].fees.fee) * amount) / restFees;

      if (
        euroWithFees >= fees[i].fees.min_price &&
        euroWithFees <= fees[i].fees.max_price
      ) {
        return {
            fees:  Number(fees[i].fees.fee) / 100 ,
            amountWithoutFees: amount,
            amount:  euroWithFees 
        }
      }
    }
  }
};
 