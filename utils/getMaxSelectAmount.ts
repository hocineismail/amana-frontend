import { AMOUNT_SELECTED } from "../constants/constants"

interface IMaxSelect {
    amount: number
}

export function getMaxSelectAmount({ amount }: IMaxSelect): number {
     
    return Math.floor(amount/AMOUNT_SELECTED)
}