interface IValidationCCPpayment {
  data: any;
  step?: number | undefined;
  general?: boolean | undefined;
}
interface IValidationBaridi {
  data: any;
  step?: number | undefined;
  general?: boolean | undefined;
}
interface IErrors {
  firstname: string | null;
  lastname: string | null;
  address: string | null;
}

import moment from "moment";
import validator from "validator";
import { RIP_FIXED } from "../constants/constants";
function getCurrentAge(birthday: Date): number {
  var now = moment(new Date()); //todays date
  var end = moment(new Date(birthday)); // another date
  var duration = moment.duration(now.diff(end));
  return Math.floor(duration.asYears());
}

export function validationCCPpayment({
  data,
  step,
  general,
}: IValidationCCPpayment) {
  let isError = false;
  if (step === 0) {
    if (!validator.isLength(data?.firstname, { min: 3, max: 20 })) {
      isError = true;
    }
    if (!validator.isLength(data?.lastname, { min: 3, max: 20 })) {
      isError = true;
    }
    if (!validator.isLength(data?.address, { min: 5, max: 250 })) {
      isError = true;
    }
  }
  if (step === 1) {
    var pattern = /^\d+$/;
    // const patternPhone = /[^\d]/;

    if (
      !validator.isLength(data?.ccp?.toString() || "", { min: 6, max: 14 }) ||
      !pattern.test(data?.ccp || "")
    ) {
      isError = true;
    }

    if (
      !validator.isLength(data?.key?.toString() || "", { min: 2, max: 2 }) ||
      !pattern.test(data?.key || "")
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.phone?.toString() || "", { min: 9, max: 9 })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation.toString() || "", {
        min: 2,
        max: 100,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.details.toString() || "", {
        max: 500,
      })
    ) {
      isError = true;
    }
  }
  if (general) {
    var pattern = /^\d+$/;
    // const patternPhone = /[^\d]/;

    if (
      !validator.isLength(data?.target_ccp?.ccp?.toString(), {
        min: 6,
        max: 14,
      }) ||
      !pattern.test(data?.target_ccp?.ccp)
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.target_ccp.key.toString() || "", {
        min: 2,
        max: 2,
      }) ||
      !pattern.test(data?.target_ccp?.key)
    ) {
      isError = true;
    }
    if (data?.type !== "Transfer") {
      isError = true;
    }
    if (data?.userId !== localStorage.getItem("userId")) {
      isError = true;
    }
    if (data?.status !== "Awaiting") {
      isError = true;
    }
    if (
      !validator.isLength(data?.phone_number?.toString() || "", {
        min: 9,
        max: 9,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation.toString() || "", {
        min: 2,
        max: 100,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.details.toString() || "", {
        max: 500,
      })
    ) {
      isError = true;
    }
    if (!validator.isLength(data?.fullname, { min: 6, max: 100 })) {
      isError = true;
    }

    if (!validator.isLength(data?.address, { min: 5, max: 250 })) {
      isError = true;
    }
  }
  return isError;
}

export function validationMoneyOrder({
  data,
  step,
  general,
}: IValidationCCPpayment) {
  let isError = false;
  if (step === 0) {
    if (!validator.isLength(data?.firstname, { min: 3, max: 50 })) {
      isError = true;
    }
    if (!validator.isLength(data?.lastname, { min: 3, max: 50 })) {
      isError = true;
    }
    if (!validator.isLength(data?.address, { min: 5, max: 250 })) {
      isError = true;
    }
  }
  if (step === 1) {
    if (
      !validator.isLength(data?.phone?.toString() || "", { min: 9, max: 9 })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation.toString() || "", {
        min: 2,
        max: 100,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.details.toString() || "", {
        max: 500,
      })
    ) {
      isError = true;
    }
  }
  if (general) {
    var pattern = /^\d+$/;
    // const patternPhone = /[^\d]/;

    if (data?.type !== "Transfer") {
      isError = true;
    }
    if (data?.userId !== localStorage.getItem("userId")) {
      isError = true;
    }
    if (data?.status !== "Awaiting") {
      isError = true;
    }
    if (
      !validator.isLength(data?.phone_number?.toString() || "", {
        min: 9,
        max: 9,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation.toString() || "", {
        min: 2,
        max: 100,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.details.toString() || "", {
        max: 500,
      })
    ) {
      isError = true;
    }
    if (!validator.isLength(data?.fullname, { min: 6, max: 100 })) {
      isError = true;
    }

    if (!validator.isLength(data?.address, { min: 5, max: 250 })) {
      isError = true;
    }
  }
  return isError;
}
export function validationCardLess({
  data,
  step,
  general,
}: IValidationCCPpayment) {
  let isError = false;
 
  if (step === 1) {
    if (!validator.isLength(data?.firstname || "", { min: 3, max: 50 })) {
      isError = true;
    }
    if (!validator.isLength(data?.lastname || "", { min: 3, max: 50 })) {
      isError = true;
    }

    if (
      !validator.isLength(data?.phone_number?.toString() || "", {
        min: 9,
        max: 9,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation.toString() || "", {
        min: 2,
        max: 100,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.details.toString() || "", {
        max: 500,
      })
    ) {
      isError = true;
    }
  }
  if (general) {
    var pattern = /^\d+$/;
    // const patternPhone = /[^\d]/;

    if (data?.type !== "Transfer") {
      isError = true;
    }
    if (data?.userId !== localStorage.getItem("userId")) {
      isError = true;
    }
    if (data?.status !== "Awaiting") {
      isError = true;
    }
    if (
      !validator.isLength(data?.phone_number?.toString() || "", {
        min: 9,
        max: 9,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation.toString() || "", {
        min: 2,
        max: 100,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.details.toString() || "", {
        max: 500,
      })
    ) {
      isError = true;
    }
    if (!validator.isLength(data?.fullname, { min: 3, max: 250 })) {
      isError = true;
    }
  }
  return isError;
}

export function validationBaridimob({
  data,
  step,
  general,
}: IValidationBaridi) {
  let isError = false;
  if (general) {
    var pattern = /^\d+$/;
    const numberConst = data?.target_baridiMob?.RIP.substring(0, 7);
    if (data?.type !== "Transfer") {
      isError = true;
    }
    if (data?.userId !== localStorage.getItem("userId")) {
      isError = true;
    }
    if (data?.status !== "Awaiting") {
      isError = true;
    }

    if (
      !pattern.test(data?.target_baridiMob?.RIP || "") ||
      !validator.isLength(data?.target_baridiMob?.RIP.toString() || "", {
        min: 16,
        max: 16,
      }) ||
      numberConst.toString() !== RIP_FIXED.toString()
    ) {
      isError = true;
    }

    if (
      !validator.isLength(data?.relation?.toString() || "", {
        min: 2,
        max: 1500,
      })
    ) {
      isError = true;
    }
  }
  if (step === 1) {
    var pattern = /^\d+$/;
    // const patternPhone = /[^\d]/;
    const numberConst = data?.target_baridiMob?.RIP.substring(0, 7);
 
    if (
      !pattern.test(data?.target_baridiMob?.RIP || "") ||
      !validator.isLength(data?.target_baridiMob?.RIP.toString() || "", {
        min: 16,
        max: 16,
      }) ||
      numberConst.toString() !== RIP_FIXED.toString()
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation?.toString() || "", {
        min: 2,
        max: 1500,
      })
    ) {
      isError = true;
    }
  }

  return isError;
}
export function validationFromOffice({
  data,
  step,
  general,
}: IValidationCCPpayment) {
  let isError = false;

  if (step === 0) {
    if (!validator.isLength(data?.office, { min: 3, max: 50 })) {
      isError = true;
    }
  }
  let phone = data?.phone_number || data?.phone;
  if (step === 1) {
    var pattern = /^\d+$/;
    const patternPhone = /[^\d]/;
    if (data?.fullname) {
      if (!validator.isLength(data?.fullname || "", { min: 3, max: 50 })) {
        isError = true;
      }
    } else {
      if (!validator.isLength(data?.firstname || "", { min: 3, max: 50 })) {
        isError = true;
      }
      if (!validator.isLength(data?.lastname || "", { min: 3, max: 50 })) {
        isError = true;
      }
    }

    if (!validator.isLength(phone || "", { min: 9, max: 9 })) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation.toString() || "", {
        min: 2,
        max: 100,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.details.toString() || "", {
        max: 500,
      })
    ) {
      isError = true;
    }
  }
  if (general) {
    var pattern = /^\d+$/;
    // const patternPhone = /[^\d]/;

    if (data?.type !== "Transfer") {
      isError = true;
    }
    if (data?.userId !== localStorage.getItem("userId")) {
      isError = true;
    }
    if (data?.status !== "Awaiting") {
      isError = true;
    }
    if (
      !validator.isLength(data?.phone_number?.toString() || "", {
        min: 9,
        max: 9,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation?.toString() || "", {
        min: 2,
        max: 1500,
      })
    ) {
      isError = true;
    }
    if (!validator.isLength(data?.fullname, { min: 6, max: 100 })) {
      isError = true;
    }
  }
  return isError;
}

export function validationDelivery({
  data,
  step,
  general,
}: IValidationCCPpayment) {
  let isError = false;
  let phone = data?.phone_number || data?.phone;
  if (step === 0) {
    if (!validator.isLength(data?.firstname || "", { min: 3, max: 50 })) {
      isError = true;
    }
    if (!validator.isLength(data?.lastname || "", { min: 3, max: 50 })) {
      isError = true;
    }
    if (!validator.isLength(data?.address || "", { min: 5, max: 250 })) {
      isError = true;
    }
  }
  if (step === 1) {
    var pattern = /^\d+$/;
    const patternPhone = /[^\d]/;
    if (!validator.isLength(phone?.toString() || "", { min: 9, max: 9 })) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation.toString() || "", {
        min: 2,
        max: 100,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.details.toString() || "", {
        max: 500,
      })
    ) {
      isError = true;
    }
  }
  if (general) {
    var pattern = /^\d+$/;
    // const patternPhone = /[^\d]/;

    if (data?.type !== "Transfer") {
      isError = true;
    }
    if (data?.userId !== localStorage.getItem("userId")) {
      isError = true;
    }
    if (data?.status !== "Awaiting") {
      isError = true;
    }
    if (
      !validator.isLength(phone?.toString() || "", {
        min: 9,
        max: 9,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.relation.toString() || "", {
        min: 2,
        max: 100,
      })
    ) {
      isError = true;
    }
    if (
      !validator.isLength(data?.details.toString() || "", {
        max: 500,
      })
    ) {
      isError = true;
    }
    if (!validator.isLength(data?.fullname, { min: 6, max: 100 })) {
      isError = true;
    }

    if (!validator.isLength(data?.address, { min: 5, max: 250 })) {
      isError = true;
    }
  }
  return isError;
}

export function validationPassword(password: string) {
  if (!validator.isLength(password, { min: 8 })) {
    return "Your Password must be at least 8 characters";
  }
  return null;
}

export function validationEmail(email: string) {
  if (!validator.isEmail(email)) {
    return "Email is invalid";
  }
  return null;
}

// export function validationBirthday(password: string)  {
//   if (!validator.isLength(password, { min: 8, max: 20 })) {
//     return "Password must be at between 8 and 20 characters"
//   }
//   return null
// }
export function validationPhone(phone: string) {
  if (!validator.isLength(phone, { min: 11 })) {
    return "Phone is invalid";
  }
  return null;
}
export function validationAddress(string: string) {
  const regex = new RegExp("^[^<>||=]*$");
  if (
    !regex.test(string) ||
    !validator.isLength(string, { min: 4, max: 100 })
  ) {
    return `Address is invalid`;
  }
  return null;
}
export function validationState(string: string) {
  const regex = new RegExp("^[^<>||=]*$");
  if (!regex.test(string) || !validator.isLength(string, { min: 4, max: 50 })) {
    return `State is invalid`;
  }
  return null;
}
export function validationProvince(string: string) {
  const regex = new RegExp("^[^<>||=]*$");
  if (!regex.test(string) || !validator.isLength(string, { min: 4, max: 50 })) {
    return `Province is invalid`;
  }
  return null;
}
export function validationFirstName(string: string) {
  const regex = new RegExp("^[^<>||=]*$");
  if (!regex.test(string) || !validator.isLength(string, { min: 2, max: 15 })) {
    return `First name is invalid`;
  }
  return null;
}
export function validationLastName(string: string) {
  const regex = new RegExp("^[^<>||=]*$");
  if (!regex.test(string) || !validator.isLength(string, { min: 2, max: 15 })) {
    return `Last name is invalid`;
  }
  return null;
}
export function validationBirthday(birthday: Date) {
  let isValidBirthday: number = getCurrentAge(birthday || new Date());

  if (isValidBirthday < 18) {
    return `You must be over 18 years old`;
  }
  return null;
}
export function validationInformation(data: any) {
  if (validationEmail(data.email)) {
    return true;
  }

  if (validationPhone(data.phone)) {
    return true;
  }
  if (validationAddress(data.address)) {
    return true;
  }
  if (validationState(data.state)) {
    return true;
  }
  if (validationProvince(data.province)) {
    return true;
  }
  return false;
}
export function validationSignupStepOne(data: any) {
  if (validationEmail(data.email)) {
    return true;
  }
  if (validationPhone(data.phone)) {
    return true;
  }
  if (validationFirstName(data.firstname)) {
    return true;
  }
  if (validationLastName(data.lastname)) {
    return true;
  }
  if (validationBirthday(data.birthday)) {
    return true;
  }
  return false;
}
export function validationSignupStepTwo(data: any) {
  if (validationState(data.state)) {
    return true;
  }
  if (validationProvince(data.province)) {
    return true;
  }
  if (validationAddress(data.address)) {
    return true;
  }
  if (validationPassword(data.password)) {
    return true;
  }

  return false;
}
