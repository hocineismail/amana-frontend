interface IFees  {
    amount: Number
   fees: any[] 
}
export function getFeeAmana({amount, fees}: IFees) {
    for (let i = 0; i < fees.length; i++) {
      if (
        amount >= fees[i].fees.min_price &&
        amount <= fees[i].fees.max_price
      ) {
        if (fees[i].fees.type === "fix") {
          return Number(fees[i].fees.fee);
        } else {
          return (Number(amount) * Number(fees[i].fees.fee)) / 100;
        }
      }
    }
  }
export  function setFeeAmana({amount, fees}: IFees) {
    let reversed = fees.reverse();
    console.log(reversed);
    for (let i = 0; i < reversed.length; i++) {
      let euroWithFees = Number(amount) + Number(reversed[i].fees.fee);
      if (
        euroWithFees >= reversed[i].fees.min_price &&
        euroWithFees <= reversed[i].fees.max_price
      ) {
        return Number(reversed[i].fees.fee);
      }
    }
  }