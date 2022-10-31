import React from "react";

import Layout from "../../components/layout/Layout";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-multi-date-picker";
// import { Calendar } from "react-multi-date-picker";
import "react-phone-input-2/lib/style.css";

type Props = {};
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app, db } from "../../firebase/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Illistartion from "../../public/images/undraw_transfer_money_re_6o1h.svg";

import Image from "next/image";
import { useRouter } from "next/router";
import { isValidSignupStepOne } from "../../utils/isValidSignupStepOne";
import moment from "moment";
import {
  validationAddress,
  validationBirthday,
  validationEmail,
  validationFirstName,
  validationLastName,
  validationPassword,
  validationPhone,
  validationProvince,
  validationSignupStepOne,
  validationSignupStepTwo,
  validationState,
} from "../../utils/validation";
import Head from "next/head";

interface IForm {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  country: string;
  state: string;
  province: string;
  address: string;
  password: string;
  birthday: string;
  confirmPassword?: string | undefined;
}
export default function Signup({}: Props) {
  const [firebaseError, setFirebaseError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<any>({
    email: null,
    firstname: null,
    lastname: null,
    phone: null,
    country: null,
    state: null,
    province: null,
    address: null,
    birthday: null,
    password: null,
    confirmPassword: null,
  });

  const Router = useRouter();
  const [value, setValue] = React.useState<any>(
    moment().subtract(18, "years").format("YYYY/MM/DD")
  );
  const [step, setstep] = React.useState<number>(0);
  const [form, setForm] = React.useState<IForm>({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    country: "",
    state: "",
    province: "",
    address: "",
    birthday: moment().subtract(18, "years").format("YYYY/MM/DD"),
    password: "",
    confirmPassword: "",
  });
  const onChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: null });
  };
  const nextStep = () => {
    (window as any).scrollTo(0, 0);
    if (step === 1) {
      signup();
    } else {
      setstep(step + 1);
    }
  };
  const prevStep = () => {
    setstep(step - 1);
  };
  const signup = () => {
    setFirebaseError(null);
    const auth = getAuth(app);

    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        // Create an initial document to update.
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          status: "active",
          fullname: form.firstname + " " + form.lastname,
          phone: form.phone,
          email: form.email,
          country: form.country,
          state: form.state,
          province: form.province,
          address: form.address,
          birthday: new Date(value),
          amount_blocked: 0,
          createdAt: serverTimestamp(),
        });

        const wallet = doc(db, "wallets", user.uid);
        await setDoc(wallet, {
          amount: 0,
          createdAt: serverTimestamp(),
        });
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("userId", user.uid);
        Router.push("/");
      })
      .catch((error) => {
        function getRefinedFirebaseAuthErrorMessage(
          errorMesssage: string
        ): string {
          return errorMesssage
            .replace("Error ", "")
            .replace("Firebase: ", "")
            .replace("(auth/", "")
            .replace(")", "");
        }
        // email-already-in-use.
        let errorMessage = getRefinedFirebaseAuthErrorMessage(error.message);
        if (errorMessage === "email-already-in-use.") {
          setFirebaseError(`This email ${form.email} already exists`);
        }
        // ..
      });
  };
  const onCheckEmail = () => {
    let result = validationEmail(form.email);
    setErrors({ ...errors, email: result });
  };
  const onCheckLastname = () => {
    let result = validationLastName(form.lastname);

    setErrors({ ...errors, lastname: result });
  };
  const onCheckFirstname = () => {
    let result = validationFirstName(form.firstname);
    setErrors({ ...errors, firstname: result });
  };
  const onCheckPhone = () => {
    let result = validationPhone(form.phone);
    setErrors({ ...errors, phone: result });
  };

  const onCheckAddress = () => {
    let result = validationAddress(form.address);
    setErrors({ ...errors, address: result });
  };
  const onCheckProvince = () => {
    let result = validationProvince(form.province);
    setErrors({ ...errors, province: result });
  };
  const onCheckState = () => {
    let result = validationState(form.state);
    setErrors({ ...errors, state: result });
  };
  const onCheckBirthday = (e: any) => {
    let result = validationBirthday(e);
    setErrors({ ...errors, birthday: result });
  };
  const onCheckValidationPassowrd = () => {
    let result = validationPassword(form.password);

    if (form.password !== form.confirmPassword) {
      setErrors({
        ...errors,
        password: result,
        confirmPassword: "Password doesn't match",
      });
    } else {
      setErrors({ ...errors, newPassword: result });
    }
  };
  const onCheckConfirmPassowrd = () => {
    if (form.password !== form.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Password doesn't match" });
    } else {
    }
  };
  return (
    <>
      <Head>
        <title> Sign up | Amana - أمانة </title>
      </Head>
      <Layout>
        <div
          className="flex justify-center container  mx-auto"
          style={{ fontWeight: "bold", minHeight: "70vh" }}
        >
          {" "}
          <div
            className="
            w-[100%] 
             md:m-5 
            md:p-5 
            sm:m-0 
            sm:p-0 
            "
          >
            {" "}
            <div className="grid  grid-cols-1 md:grid-cols-2   gap-2">
              <div className=" justify-center container  mx-auto  hidden md:flex">
                <div
                  style={{ maxWidth: "450px", width: "100%", margin: "auto" }}
                >
                  <Image src={Illistartion} />
                </div>
              </div>
              <div style={{ padding: "12px" }}>
                <div
                  style={{ maxWidth: "500px", width: "100%", margin: "auto" }}
                >
                  <h1
                    style={{
                      fontSize: "20px",
                      textAlign: "center",
                      margin: "10px 0px",
                    }}
                  >
                    Create Account
                  </h1>
                  {firebaseError ? (
                    <div
                      className="font-normal pb-5 font-10 text-red"
                      style={{
                        padding: "10px",
                        marginBottom: "5px",
                        border: "1px solid rgb(252, 103, 103)",
                        borderRadius: "10px",
                        background: "rgba(248, 168, 168, 0.333)",
                      }}
                    >
                      {" "}
                      <ul>
                        <li>{firebaseError}</li>
                      </ul>
                    </div>
                  ) : null}

                  <div>
                    {step === 0 ? (
                      <>
                        <div className="grid grid-cols-1  md:grid-cols-2  gap-2">
                          <div className="mb-5">
                            <label className="font-bold text-blue ">
                              First name
                            </label>
                            <input
                              type="firstname"
                              placeholder="Enter your first name"
                              className={` rounded-2xl mt-2  ${
                                errors.firstname
                                  ? "input-error border-red focus:border-red border-2"
                                  : "input"
                              }  w-full h-12  text-pink-500`}
                              name="firstname"
                              onBlur={onCheckFirstname}
                              value={form.firstname}
                              onChange={onChangeForm}
                            />
                            {errors.firstname ? (
                              <span style={{ color: "red", fontSize: "12px" }}>
                                {errors.firstname}
                              </span>
                            ) : null}
                          </div>
                          <div className="mb-5">
                            <label className="font-bold text-blue ">
                              Last name
                            </label>
                            <input
                              type="lastname"
                              placeholder="Enter your last name"
                              className={` rounded-2xl mt-2  ${
                                errors.lastname
                                  ? "input-error border-red focus:border-red border-2"
                                  : "input"
                              }  w-full h-12  text-pink-500`}
                              name="lastname"
                              value={form.lastname}
                              onBlur={onCheckLastname}
                              onChange={onChangeForm}
                            />
                            {errors.lastname ? (
                              <span style={{ color: "red", fontSize: "12px" }}>
                                {errors.lastname}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-5">
                          <label className="font-bold text-blue ">Email</label>
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className={`rounded-2xl mt-3${
                              errors.email
                                ? " border-red focus:border-red border-2"
                                : ""
                            }  w-full h-12 text-bold text-pink-500`}
                            name="email"
                            value={form.email}
                            onBlur={onCheckEmail}
                            onChange={onChangeForm}
                          />
                          {errors.email ? (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.email}
                            </span>
                          ) : null}
                        </div>
                        <label className="font-bold text-blue pb-50">
                          Birdthay
                        </label>
                        <div className="customDatePickerWidth  mb-5">
                          <DatePicker
                            value={value}
                            editable={false}
                            minDate="1900/01/01"
                            maxDate={moment()
                              .subtract(18, "years")
                              .format("YYYY/MM/DD")}
                            onChange={(e) => {
                              setValue(e);

                              setForm({
                                ...form,
                                birthday: (e as any).format(),
                              });
                              onCheckBirthday(e);
                            }}
                            inputClass={
                              errors.birthday
                                ? `form-control  form-control-error customDatePickerWidth rounded-2xl mt-2     w-full h-12  text-pink-500`
                                : ` form-control customDatePickerWidth rounded-2xl mt-2   w-full h-12  text-pink-500`
                            }
                            placeholder="Enter your Birdthay"
                          />
                          {errors.birthday ? (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.birthday}
                            </span>
                          ) : null}
                        </div>
                        {/* <input
                      type="date"
                      min="1900-01-01"
                      max="2100-13-13"
                      placeholder="Enter your Birdthay"
                      className="input rounded-2xl mt-2 mb-5   w-full h-12  text-pink-500"
                      name="birthday"
                      value={form.birthday}
                      onChange={onChangeForm}
                    /> */}
                        <label className="font-bold text-blue  ">Phone</label>
                        <PhoneInput
                          country={"DZ"}
                          searchPlaceholder={"Search"}
                          value={form.phone}
                          enableSearch={true}
                          onBlur={onCheckPhone}
                          inputClass={errors.phone ? ` form-control-error` : ``}
                          onChange={(phone, data: any, b, c) => {
                            setForm({
                              ...form,
                              country: data?.name,
                              phone: phone,
                            });
                            setErrors({ ...errors, phone: null });
                          }}
                        />{" "}
                        {errors.phone ? (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.phone}
                          </span>
                        ) : null}
                        <br />
                      </>
                    ) : (
                      <div>
                        <div className="mb-5">
                          <label className="font-bold text-blue  ">
                            County
                          </label>
                          <input
                            type="string"
                            className="input rounded-2xl mt-2  w-full h-12  text-pink-500"
                            name="county"
                            disabled
                            value={form.country}
                          />
                        </div>
                        <div className="mb-5">
                          <label className="font-bold text-blue  ">State</label>
                          <input
                            type="text"
                            placeholder="Enter your State"
                            className={`rounded-2xl mt-3${
                              errors.state
                                ? " border-red focus:border-red border-2"
                                : ""
                            }  w-full h-12 text-bold text-pink-500`}
                            name="state"
                            onBlur={onCheckState}
                            value={form.state}
                            onChange={onChangeForm}
                          />
                          {errors.state ? (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.state}
                            </span>
                          ) : null}
                        </div>{" "}
                        <div className="mb-5">
                          <label className="font-bold text-blue  ">
                            Province
                          </label>
                          <input
                            type="text"
                            placeholder="Enter your Province"
                            className={`rounded-2xl mt-3${
                              errors.province
                                ? " border-red focus:border-red border-2"
                                : ""
                            }  w-full h-12 text-bold text-pink-500`}
                            name="province"
                            value={form.province}
                            onBlur={onCheckProvince}
                            onChange={onChangeForm}
                          />
                          {errors.province ? (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.province}
                            </span>
                          ) : null}
                        </div>
                        <div className="mb-5">
                          <label className="font-bold text-blue  ">
                            Address
                          </label>
                          <input
                            type="text"
                            placeholder="Enter your Address"
                            className={`rounded-2xl mt-3${
                              errors.address
                                ? " border-red focus:border-red border-2"
                                : ""
                            }  w-full h-12 text-bold text-pink-500`}
                            name="address"
                            value={form.address}
                            onBlur={onCheckAddress}
                            onChange={onChangeForm}
                          />
                          {errors.address ? (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.address}
                            </span>
                          ) : null}
                        </div>{" "}
                        <div className="mb-5">
                          <label className="font-bold text-blue  ">
                            Password
                          </label>
                          <input
                            type="password"
                            value={form.password}
                            placeholder="Enter your Passworsd"
                            className={`rounded-2xl mt-3${
                              errors.password
                                ? " border-red focus:border-red border-2"
                                : ""
                            }  w-full h-12 text-bold text-pink-500`}
                            name="password"
                            onBlur={onCheckValidationPassowrd}
                            onChange={onChangeForm}
                          />{" "}
                          {errors.password ? (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.password}
                            </span>
                          ) : null}
                        </div>
                        <div className="mb-5">
                          <label className="font-bold text-blue  ">
                            Confirm password
                          </label>
                          <input
                            type="password"
                            placeholder="Confirm your Password"
                            value={form.confirmPassword}
                            className={`rounded-2xl mt-3${
                              errors.confirmPassword
                                ? " border-red focus:border-red border-2"
                                : ""
                            }  w-full h-12 text-bold text-pink-500`}
                            name="confirmPassword"
                            onBlur={onCheckConfirmPassowrd}
                            onChange={onChangeForm}
                          />
                          <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.confirmPassword}
                          </span>{" "}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center  items-center  m-auto">
                    {step !== 0 ? (
                      <button
                        onClick={prevStep}
                        className="w-[70%] mt-2 pl-10 pr-10    fw-400 text-black bg-gray
                      border border-gray  h-12
                      justify-item 
                      hover:bg-gray  focus:ring-4 
                      focus:ring-gray-300 font-bold 
                      rounded-2xl  text-base px-5 py-2.5
                      text-center mr-2 mb-2 dark:bg-gray-600 
                    dark:hover:bg-gray dark:focus:ring-gray-800
                      font-sans"
                      >
                        Back
                      </button>
                    ) : null}
                    {step === 0 ? (
                      <button
                        disabled={validationSignupStepOne(form)}
                        className={`w-[70%] mt-2 pl-10 pr-10 
                        fw-400  ${
                          validationSignupStepOne(form)
                            ? "text-black bg-gray cursor-not-allowed hover:bg-gray dark:hover:bg-gray border border-gray"
                            : "text-white  bg-blue hover:bg-blue dark:hover:bg-blue  border border-blue"
                        }
                         h-12
                        justify-item 
                          focus:ring-4 
                        focus:ring-blue-300 font-bold 
                        rounded-2xl  text-base px-5 py-2.5
                        text-center mr-2 mb-2 dark:bg-blue-600 
                        dark:hover:bg-blue dark:focus:ring-blue-800
                        font-sans`}
                        onClick={() => nextStep()}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        disabled={
                          validationSignupStepTwo(form) ||
                          (form.password.length > 7 &&
                            form.password.length < 21 &&
                            form.password !== form.confirmPassword)
                        }
                        className={`w-[70%] mt-2 pl-10 pr-10 
                        fw-400  ${
                          validationSignupStepTwo(form) ||
                          (form.password.length > 7 &&
                            form.password.length < 21 &&
                            form.password !== form.confirmPassword)
                            ? "text-black bg-gray cursor-not-allowed hover:bg-gray dark:hover:bg-gray border border-gray"
                            : "text-white  bg-blue hover:bg-blue dark:hover:bg-blue  border border-blue"
                        }
                         h-12
                        justify-item 
                          focus:ring-4 
                        focus:ring-blue-300 font-bold 
                        rounded-2xl  text-base px-5 py-2.5
                        text-center mr-2 mb-2 dark:bg-blue-600 
                        dark:hover:bg-blue dark:focus:ring-blue-800
                        font-sans`}
                        onClick={() => nextStep()}
                      >
                        Sign up
                      </button>
                    )}

                    {/* <button
                  onClick={nextStep}
                  className="w-[70%] mt-2 pl-10 pr-10    fw-400 text-white bg-blue
                    border border-blue  h-12
                    justify-item 
                    hover:bg-blue  focus:ring-4 
                    focus:ring-blue-300 font-bold 
                    rounded-2xl  text-base px-5 py-2.5
                    text-center mr-2 mb-2 dark:bg-blue-600 
                  dark:hover:bg-blue dark:focus:ring-blue-800
                    font-sans"
                >
                  {step !== 1 ? "next" : "Signup"}
                </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>{" "}
    </>
  );
}
