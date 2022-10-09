import { BARIDIMOB, CCP, CHARGE, TRANSFER } from "../constants/constants";
import { getCurrentcyFormat } from "../utils/getCurrencyFormat";

interface IValidationAmount {
  type: string;
  currentAmount: number;
  walletAmount?: number;
  maxAmount: number;
  minAmount: number;
}

export function isValidAmount({
  type,
  currentAmount,
  walletAmount,
  maxAmount,
  minAmount,
}: IValidationAmount) {
  if (type === CHARGE) {
    if (maxAmount > currentAmount) {
      return {
        error: true,
        msg: `The maximum charge for wallet is ${maxAmount}`,
      };
    } else if (minAmount < currentAmount) {
      return {
        error: true,
        msg: `The minimum charge for wallet is ${maxAmount}`,
      };
    } else {
      return {
        error: false,
        msg: `fees € 0 |  ${getCurrentcyFormat({
          currency: "EUR",
          amount: currentAmount,
        })}   will be credited to your wallet `,
      };
    }
  }
}

interface IValidationAmountTransferCCP {
  currentAmount: number;
  walletAmount: number;
  maxAmount: number;
  minAmount: number;
  method: string;
}
interface IValidationAmountTransferCCPRETURN {
  error: boolean;
  msg: string;
}
export function isValidAmountTransferCCP({
  currentAmount,
  walletAmount,
  maxAmount,
  minAmount,
  method,
}: IValidationAmountTransferCCP): IValidationAmountTransferCCPRETURN {
  if (method === CCP) {
    if (
      Number(maxAmount) <= Number(currentAmount) &&
      walletAmount > currentAmount
    ) {
      return {
        error: true,
        msg: `The maximum Transfer is ${getCurrentcyFormat({
          amount: maxAmount,
          currency: "DZD",
        })}`,
      };
    } else if (Number(minAmount) > Number(currentAmount)) {
      return {
        error: true,
        msg: `The minimum Transfer is ${getCurrentcyFormat({
          amount: minAmount,
          currency: "DZD",
        })}`,
      };
    } else if (walletAmount < currentAmount) {
      return {
        error: true,
        msg: `The maximum Transfer is ${getCurrentcyFormat({
          amount: walletAmount,
          currency: "DZD",
        })}  `,
      };
    } else {
      return {
        error: false,
        msg: `fees € 0 |  ${getCurrentcyFormat({
          currency: "EUR",
          amount: currentAmount,
        })}   will be credited to your wallet `,
      };
    }
  } else {
    return {
      error: true,
      msg: `Something Wrong, can you report this problemn or come beck later`,
    };
  }
}

interface IValidationAmountTransferBARIDIMOB {
  currentAmount: number;
  walletAmount: number;
  maxAmount: number;
  minAmount: number;
}
interface IValidationAmountTransferBARIDIMOBRETURN {
  error: boolean;
  msg: string;
}
export function isValidAmountTransferBARIDIMOB({
  currentAmount,
  walletAmount,
  maxAmount,
  minAmount,
}: IValidationAmountTransferBARIDIMOB): IValidationAmountTransferBARIDIMOBRETURN {
  if (
    Number(maxAmount) <= Number(currentAmount) &&
    walletAmount > currentAmount
  ) {
    return {
      error: true,
      msg: `The maximum Transfer is  ${getCurrentcyFormat({
        currency: "DZD",
        amount: maxAmount,
      })} `,
    };
  } else if (Number(minAmount) > Number(currentAmount)) {
    return {
      error: true,
      msg: `The minimum Transfer is   ${getCurrentcyFormat({
        currency: "DZD",
        amount: minAmount,
      })}  `,
    };
  } else if (walletAmount < currentAmount) {
    return {
      error: true,
      msg: `The maximum Transfer is  ${getCurrentcyFormat({
        currency: "DZD",
        amount: walletAmount,
      })}  `,
    };
  } else {
    return {
      error: false,
      msg: `fees € 0 |  ${getCurrentcyFormat({
        currency: "EUR",
        amount: currentAmount,
      })}   will be credited to your wallet `,
    };
  }
}
