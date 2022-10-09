import moment from "moment";
import validator from "validator";

let phoneRegex = /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g
let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
let birthdayRegex = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/g;
function getCurrentAge(birthday: Date) {
    var now = moment(new Date()); //todays date
    var end = moment(birthday); // another date
    var duration = moment.duration(now.diff(end));
    return Math.floor(duration.asYears())
}


export function isValidSignupStepOne({ data }: any) {
   
    let errors: string[] = []
    const isValidPhone = validator.isLength(data.phone, { min: 11 }) && validator.isMobilePhone(data.phone)
    const isValidEmail = data.email.match(emailRegex);
 

    const isLegalUser = getCurrentAge(data.birthday)
    alert(isLegalUser)
    
    if (!isValidPhone) {
        errors.push("Enter a valid Phone Number ")
    }
    if (data.lastname.length === 0) {
        errors.push("Enter a valid Last name")
    }
    if (data.firstname.length === 0) {
        errors.push("Enter a valid first name")
    }
    if (!isValidEmail) {
        errors.push("Enter a valid Email")
    }

}