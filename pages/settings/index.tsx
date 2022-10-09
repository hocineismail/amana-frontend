import React from "react";

import Layout from "../../components/layout/Layout";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-multi-date-picker";
import "react-phone-input-2/lib/style.css";

import {
  getAuth,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { app, db } from "../../firebase/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Illistartion from "../../public/images/undraw_personal_information_re_vw8a.svg";
import IllistartionPassword from "../../public/images/undraw_my_password_re_ydq7.svg";
import Swal from "sweetalert2";
import Image from "next/image";
import { useRouter } from "next/router";
import useCurrentUser from "../../hooks/useCurrentUser";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { async } from "@firebase/util";
import { useAppSelector } from "../../hooks/useReduxHook";
import { userState } from "../../features/userSlice";
import {
  validationEmail,
  validationPassword,
  validationPhone,
  validationAddress,
  validationState,
  validationProvince,
  validationInformation,
} from "../../utils/validation";
import moment from "moment";

type Props = {};
interface IForm {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  country: string;
  state: string;
  address: string;
  password: string;
  birthday: string;
}
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: `text-white  bg-blue
              border border-blue
              hover:bg-blue  focus:ring-4 
              focus:ring-blue-300 font-medium 
              rounded-2xl text-sm px-5 py-2.5
              text-center mr-2 mb-2 dark:bg-blue-600 
            dark:hover:bg-blue dark:focus:ring-blue-800`,
    cancelButton: `text-[#000] bg-gray
              border border-gray
              hover:bg-gray  focus:ring-4 
              focus:ring-gray-300 font-medium 
              rounded-2xl text-sm px-5 py-2.5
              text-center mr-2 mb-2 dark:bg-gray-600 
            dark:hover:bg-gray dark:focus:ring-gray-800`,
  },
  buttonsStyling: false,
});
export default function Signup({}: Props) {
  const Router = useRouter();
  const [passwordConfirmed, setpasswordConfirmed] = React.useState<any>(false);
  const [disabled, setdisabled] = React.useState<boolean>(true);
  const [loading, setloading] = React.useState<any>(false);
  const [form, setForm] = React.useState<any>({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    country: "",
    state: "",
    province: "",
    address: "",
    birthday: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [password, setpassword] = React.useState<any>({
    newPassword: "",
    confirmNewPassword: "",
  });
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
    oldPassword: null,
    newPassword: null,
    confirmNewPassword: null,
  });
  const { currentUser } = useFirebaseAuth();
  const { getFullDetails } = useCurrentUser();
  const { userDetails } = useAppSelector(userState);
  console.log(userDetails);
  React.useEffect(() => {
    if (!!currentUser) {
      getFullDetails();
    }
  }, [currentUser]);

  React.useEffect(() => {
    if (!userDetails) {
      getFullDetails();
    } else {
      setForm({
        email: userDetails.email,
        fullname: userDetails.fullname,
        phone: userDetails.phone,
        country: userDetails.country,
        state: userDetails.state,
        address: userDetails.address,
        province: userDetails.province,
        birthday: moment(userDetails.birthday.toDate().toString()).format(
          "YYYY/MM/DD"
        ),
      });
    }
  }, [userDetails]);

  const onChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({
      ...errors,
      [event.target.name]: null,
    });
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const [display, setdisplay] = React.useState({
    auth: false,
    information: true,
  });
  const onUpdateInformation = () => {
    //Check if email is changed

    let auth = getAuth(app);
    swalWithBootstrapButtons
      .fire({
        title: "Current Password",
        input: "password",
        inputAttributes: {
          autocapitalize: "off",
        },
        inputValidator: (value) => {
          if (!value) return "Your text here";
          else return null;
        },
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: (passowrd) => {
          setloading(true);
          signInWithEmailAndPassword(
            auth,
            userDetails.email,
            passowrd.toString()
          )
            .then(async () => {
              // setpasswordConfirmed(true);
            })
            .then(async () => {
              if (display.information) {
                if (form.email !== userDetails.email) {
                  console.log(form.email !== userDetails.email);
                  updateEmail(currentUser, form.email.toString())
                    .then(async () => {
                      const requestRef = doc(db, "users", currentUser.uid);
                      await updateDoc(requestRef, {
                        address: form.address,
                        country: form.country,
                        email: form.email,
                        phone: form.phone,
                        state: form.state,
                      });
                      swalWithBootstrapButtons.fire(
                        "Confirmed!",
                        "You information has Changed",
                        "success"
                      );
                    })
                    .then(() => {
                      setloading(false);
                      signInWithEmailAndPassword(
                        auth,
                        form.email,
                        passowrd.toString()
                      );
                    })
                    .catch((error) => {});
                } else {
                  const requestRef = doc(db, "users", currentUser.uid);
                  await updateDoc(requestRef, {
                    address: form.address,
                    country: form.country,
                    email: form.email,
                    phone: form.phone,
                    state: form.state,
                  });
                  swalWithBootstrapButtons
                    .fire(
                      "Confirmed!",
                      "You information has Changed",
                      "success"
                    )
                    .then(() => {
                      setloading(false);
                      signInWithEmailAndPassword(
                        auth,
                        form.email,
                        passowrd.toString()
                      );
                    });
                }
              } else {
                console.log(currentUser);
                console.log(form.newPassword);
                updatePassword(currentUser, password.newPassword)
                  .then((res) => {
                    console.log(res);
                    swalWithBootstrapButtons
                      .fire(
                        "Confirmed!",
                        "Your password has Updated",
                        "success"
                      )
                      .then(() => {
                        setloading(false);
                        setpassword({
                          newPassword: "",
                          confirmNewPassword: "",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    // An error ocurred
                    // ...
                  });
              }
            })
            .catch((error) => {
              swalWithBootstrapButtons
                .fire("Oups!", "Your password is incorrect", "error")
                .then(() => {
                  setloading(false);
                });

              // const errorCode = error.code;
              // const errorMessage = error.message;
              // console.log(errorCode);
            });
        },
      })
      .then(async (result) => {
        // if (passwordConfirmed) {
        //   if (form.email !== userDetails.email) {
        //     console.log(form.email !== userDetails.emai);
        //     updateEmail(currentUser, form.email.toString())
        //       .then(async () => {
        //         alert("Email updated!");
        //         const requestRef = doc(db, "users", currentUser.uid);
        //         await updateDoc(requestRef, {
        //           address: form.address,
        //           country: form.country,
        //           email: form.email,
        //           phone: form.phone,
        //           state: form.state,
        //         });
        //         swalWithBootstrapButtons.fire(
        //           "Confirmed!",
        //           "You information has Changed",
        //           "success"
        //         );
        //       })
        //       .catch((error) => {
        //         console.log(error);
        //         // An error occurred
        //         // ...
        //       });
        //   } else {
        //     const requestRef = doc(db, "users", currentUser.uid);
        //     await updateDoc(requestRef, {
        //       address: form.address,
        //       country: form.country,
        //       phone: form.phone,
        //       state: form.state,
        //     });
        //     swalWithBootstrapButtons.fire(
        //       "Confirmed!",
        //       "You information has Changed",
        //       "success"
        //     );
        //   }
        // }
      });
    // alert(form.email !== userDetails.email);
    // if (form.email !== userDetails.email) {
    //   updateEmail(currentUser, form.email.toString())
    //     .then(() => {
    //       alert("Email updated!");
    //       // Email updated!
    //       // ...
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       // An error occurred
    //       // ...
    //     });
    // }
  };
  const onCheckValidationPassowrd = () => {
    let result = validationPassword(password.newPassword);

    if (password.newPassword !== password.confirmNewPassword) {
      setErrors({
        ...errors,
        newPassword: result,
        confirmNewPassword: "Password doesn't match",
      });
    } else {
      setErrors({ ...errors, newPassword: result });
    }
  };
  const onCheckConfirmPassowrd = () => {
    if (password.newPassword !== password.confirmNewPassword) {
      setErrors({ ...errors, confirmNewPassword: "Password doesn't match" });
    } else {
    }
  };
  const onCheckEmail = () => {
    let result = validationEmail(form.email);
    setErrors({ ...errors, email: result });
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
  return (
    <Layout>
      <>
        {loading ? <div className="loading">Loading&#8230;</div> : null}
        <div
          className="flex justify-center container  mx-auto"
          style={{ fontWeight: "bold", minHeight: "70vh", marginTop: 100 }}
        >
          <div
            className="
            w-[100%] m-0 p-0 ms:m-5 ms:p-5 
            "
          >
            <h1
              style={{
                fontSize: "20px",
                textAlign: "center",
                margin: "10px 0px",
              }}
            >
              Edit information
            </h1>
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-2">
              <div className=" justify-center container  mx-auto  hidden md:flex">
                <div
                  style={{
                    maxWidth: "450px",
                    width: "100%",
                    margin: "auto",
                    transition: "0.3s",
                  }}
                >
                  <Image
                    src={
                      display.information ? Illistartion : IllistartionPassword
                    }
                  />
                </div>
              </div>
              <div
                className=" relative p-10 md:p-10  "
                style={{ minHeight: "85vh" }}
              >
                <div>
                  <div style={{ display: "inline-block" }}>
                    <button
                      data-testid="send"
                      style={{ borderColor: "transparent", fontSize: "bold" }}
                      className="bg-transparent w-20 border ml-4 mt-4 "
                      onClick={() =>
                        setdisplay({ auth: false, information: true })
                      }
                    >
                      <span style={{ fontWeight: "bold", width: "150px" }}>
                        Information
                      </span>
                    </button>
                  </div>
                  <div style={{ display: "inline-block" }}>
                    <button
                      data-testid="send"
                      style={{ borderColor: "transparent", fontSize: "bold" }}
                      className="bg-transparent w-20 border ml-8 mt-4 "
                      onClick={() =>
                        setdisplay({ auth: true, information: false })
                      }
                    >
                      <span style={{ fontWeight: "bold", width: "150px" }}>
                        Password
                      </span>
                    </button>
                  </div>

                  <div
                    style={{ transition: "0.2s" }}
                    className={`w-20 rounded-2xl bg-blue  ${
                      display.information ? "ml-5" : "ml-32"
                    }  mt-2 h-1`}
                  ></div>
                </div>

                <div className="relative mt-6  bg-black rounded-lg shadow dark:bg-gray-700">
                  {display.information ? (
                    <div>
                      <>
                        <div>
                          <label className="font-bold text-blue ">
                            Full name
                          </label>
                          <input
                            type="full name"
                            placeholder="Enter your full name"
                            className="input rounded-2xl mt-2 mb-5   w-full h-12  text-pink-500"
                            name="fullname"
                            value={form.fullname}
                            disabled={true}
                          />
                        </div>
                        <div className="mb-5  ">
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
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
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
                        <div className="customDatePickerWidth">
                          <DatePicker
                            readOnly={true}
                            value={form.birthday}
                            editable={false}
                            minDate="1990/01/01"
                            maxDate={new Date()}
                            onChange={(e) => {
                              setForm({
                                ...form,
                                birthday: (e as any).format(),
                              });
                            }}
                            inputClass="input customDatePickerWidth rounded-2xl mt-2 mb-5   w-full h-12  text-pink-500"
                            placeholder="Enter your Birdthay"
                          />
                        </div>
                        {/* <div>
                          <label className="font-bold text-blue pb-50">
                            Date of Birdthay
                          </label>
                          <input
                            type="date"
                            placeholder="Enter your Birdthay"
                            className="input rounded-2xl mt-2 mb-5   w-full h-12  text-pink-500"
                            name="birthday"
                            value={form.birthday}
                            disabled={true}
                          />
                        </div> */}
                        <div>
                          <label className="font-bold text-blue  ">
                            Phone Number
                          </label>
                          <PhoneInput
                            country={"DZ"}
                            searchPlaceholder={"Search"}
                            value={form.phone}
                            enableSearch={true}
                            //inputClass="input rounded-2xl mt-2   w-full h-12  text-pink-500"
                            // inputClass={`rounded-2xl  mt-3${
                            //   errors.phone
                            //     ? " border-red focus:border-red border-2"
                            //     : ""
                            // }  w-full h-12 text-bold text-pink-500`}
                            onBlur={onCheckPhone}
                            isValid={(value: any, country: any) => {
                              if (value.match(/12345/)) {
                                return (
                                  "Invalid value: " +
                                  value +
                                  ", " +
                                  country.name
                                );
                              } else if (value.match(/1234/)) {
                                console.log("hello");
                                return false;
                              } else {
                                return true;
                              }
                            }}
                            inputProps={{
                              name: "phone",
                              required: true,
                            }}
                            onChange={(phone, data: any, b, c) => {
                              console.log(data);
                              setForm({
                                ...form,
                                country: data?.name,
                                phone: phone,
                              });
                            }}
                          />
                          {errors.phone ? (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.phone}
                            </span>
                          ) : null}
                        </div>
                        <br />

                        <div className="grid grid-cols-1  md:grid-cols-2  gap-2">
                          <div>
                            <label className="font-bold text-blue  ">
                              County
                            </label>
                            <input
                              type="string"
                              className="input rounded-2xl mt-2 mb-5   w-full h-12  text-pink-500"
                              name="county"
                              disabled
                              value={form.country}
                            />
                          </div>
                          <div className="mb-5 ">
                            <label className="font-bold text-blue  ">
                              State
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your State"
                              className={` rounded-2xl mt-2  ${
                                errors.state
                                  ? " border-red focus:border-red border-2"
                                  : ""
                              }  w-full h-12  text-pink-500`}
                              name="state"
                              value={form.state}
                              onBlur={onCheckState}
                              onChange={onChangeForm}
                              // onChange={(e) =>
                              //   setExchange({
                              //     moneyEuro: Number(e.target.value),
                              //     moneyDinar: Number(e.target.value) * exchangePrice,
                              //   })
                              //}
                            />
                            {errors.state ? (
                              <span style={{ color: "red", fontSize: "12px" }}>
                                {errors.state}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-5 ">
                          <label className="font-bold text-blue  ">
                            Province
                          </label>
                          <input
                            type="text"
                            placeholder="Enter your Address"
                            className={`rounded-2xl mt-3${
                              errors.province
                                ? " border-red focus:border-red border-2"
                                : ""
                            }  w-full h-12 text-bold text-pink-500`}
                            name="province"
                            value={form.province}
                            onBlur={onCheckProvince}
                            onChange={onChangeForm}
                            // onChange={(e) =>
                            //   setExchange({
                            //     moneyEuro: Number(e.target.value),
                            //     moneyDinar: Number(e.target.value) * exchangePrice,
                            //   })
                            //}
                          />
                          {errors.province ? (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.province}
                            </span>
                          ) : null}
                        </div>
                        <div className="mb-5 ">
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
                            // onChange={(e) =>
                            //   setExchange({
                            //     moneyEuro: Number(e.target.value),
                            //     moneyDinar: Number(e.target.value) * exchangePrice,
                            //   })
                            //}
                          />
                          {errors.address ? (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.address}
                            </span>
                          ) : null}
                        </div>
                      </>
                    </div>
                  ) : (
                    <>
                      <div className=" mb-5 ">
                        <label className="font-bold text-blue  ">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter your new password"
                          className={`rounded-2xl mt-3${
                            errors.newPassword
                              ? " border-red focus:border-red border-2"
                              : ""
                          }  w-full h-12 text-bold text-pink-500`}
                          name="newPassword"
                          onBlur={onCheckValidationPassowrd}
                          value={password.newPassword}
                          onChange={(e) => {
                            setpassword({
                              ...password,
                              newPassword: e.target.value,
                            });
                            setErrors({
                              ...errors,
                              newPassword: null,
                            });
                          }}
                        />

                        {errors.newPassword ? (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.newPassword}
                          </span>
                        ) : null}
                      </div>

                      <div className="mb-5 ">
                        <label className="font-bold text-blue  ">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter your new passowrd"
                          className={`rounded-2xl mt-3${
                            errors.confirmNewPassword
                              ? " border-red focus:border-red border-2"
                              : ""
                          }  w-full h-12 text-bold text-pink-500`}
                          name="confirmButton"
                          onBlur={onCheckConfirmPassowrd}
                          value={password.confirmNewPassword}
                          onChange={(e) => {
                            setpassword({
                              ...password,
                              confirmNewPassword: e.target.value,
                            });
                            setErrors({
                              ...errors,
                              confirmNewPassword: null,
                            });
                          }}
                        />

                        <span style={{ color: "red", fontSize: "12px" }}>
                          {errors.confirmNewPassword}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-center  items-center  m-auto">
                  {display.auth ? (
                    <button
                      className={`w-[70%] mt-2 pl-10 pr-10 
                        fw-400  ${
                          (password.newPassword || "").length < 8 ||
                          password.newPassword !== password.confirmNewPassword
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
                      onClick={() => onUpdateInformation()}
                    >
                      save
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateInformation()}
                      className={`w-[70%] mt-2 pl-10 pr-10 
                        fw-400  ${
                          validationInformation(form)
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
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
}
