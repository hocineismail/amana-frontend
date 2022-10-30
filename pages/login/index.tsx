import React, { useState } from "react";

import Layout from "../../components/layout/Layout";
import Image from "next/image";
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import IllistartionOne from "../../public/images/undraw_sign_in_re_o58h.svg";
import {
  app,
  //  appCheck
} from "../../firebase/firebase";
import { Formik, Field, Form, ErrorMessage } from "formik";
type Props = {};

import Router from "next/router";
import { getToken } from "firebase/app-check";
import Head from "next/head";

import { useFormik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { onClearSideBar } from "../../features/sidebarSlice";

const styles = {
  label: " text-blue",
  field: "input rounded-2xl mt-2    w-full h-12  text-pink-500",
  errorMsg: "font-normal pb-5 font-10 text-red",
  buttonActive: `w-[70%] mt-2 pl-10 pr-10    fw-400 text-white bg-blue
                    border border-blue  h-12
                    justify-item 
                    hover:bg-blue  focus:ring-4 
                    focus:ring-blue-300  
                    rounded-2xl  text-base px-5 py-2.5
                    text-center mr-2 mb-2 dark:bg-blue-600 
                  dark:hover:bg-blue dark:focus:ring-blue-800
                    font-sans`,
  buttonSignup: `w-[70%] mt-2 pl-10 pr-10 text-black   fw-400   bg-orange
                    border border-orange  h-12
                    justify-item 
                    hover:bg-orange  focus:ring-4 
                    focus:ring-orange-300  
                    rounded-2xl  text-base px-5 py-2.5
                    text-center mr-2 mb-2 dark:bg-orange-600 
                  dark:hover:bg-orange dark:focus:ring-orange-800
                    font-sans`,
  disbaledDisabled: `w-[70%] mt-2 pl-10 pr-10    fw-400 text-white bg-blueDisabled
                    border border-blueDisabled  h-12
                    justify-item 
                    hover:bg-blueDisabled  focus:ring-4 
                    focus:ring-blueDisabled-300  
                    rounded-2xl  text-base px-5 py-2.5
                    text-center mr-2 mb-2 dark:bg-blueDisabled-600 
                  dark:hover:bg-blueDisabled dark:focus:ring-blueDisabled-800
                    font-sans`,
  buttonDisabled: `w-[70%] mt-2 pl-10 pr-10  cursor-not-allowed  
                      fw-400 text-black bg-blue
                      border border-blue  h-12
                      justify-item 
                      hover:bg-blue  focus:ring-4 
                      focus:ring-blue-300 font-bold 
                      rounded-2xl  text-base px-5 py-2.5
                      text-center mr-2 mb-2 dark:bg-blue-600 
                    dark:hover:bg-blue dark:focus:ring-blue-800
                      font-sans`,
};
function isEmptyObject(obj: unknown) {
  return JSON.stringify(obj) === "{}";
}
function isExistErrors(obj: any) {
  if (!isEmptyObject(obj)) {
    if (obj.email !== "" || obj.password) return true;
    return false;
  }
}
export default function Login({}: Props) {
  const [allowPage, setAllowPage] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const [Errors, setErrors] = useState<String | null>(null);
  // React.useEffect(() => {
  //   if (localStorage.getItem("isAuth")) {
  //     setisAuth(true);
  //   }
  //   return () => {
  //     dispatch(onClearSideBar());
  //   };
  // }, []);
  const dispatch = useDispatch();
  React.useEffect(() => {
    // if no accessToken was found,then we redirect to "/" page.
    dispatch(onClearSideBar());
    if (!localStorage.getItem("isAuth")) {
      setAllowPage(true);
    } else {
      Router.push("/");
    }
  }, []);
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      // .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setloading(true);
      let { email, password } = values;
      setErrors(null);
      const auth = getAuth(app);
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          localStorage.setItem("isAuth", "true");
          localStorage.setItem("userId", user.uid);
          Router.push("/");
        })
        .catch((error) => {
          setloading(false);
          setErrors("Email or Password is incorrect");
        });
    },
  });

  if (!allowPage) return <div>Loading...</div>;
  return (
    <>
      <Head>
        <title> Login | Amana - أمانة </title>
      </Head>
      <Layout>
        <div
          className="flex justify-center container  mx-auto"
          style={{ fontWeight: "bold", minHeight: "70vh" }}
        >
          {" "}
          <div
            className="
            w-full
            md:m-5 
            md:p-5 
            sm:m-0 
            sm:p-0 
            "
          >
            <div className="grid  grid-cols-1 md:grid-cols-2   gap-2">
              <div className=" justify-center container  mx-auto  hidden md:flex">
                <div
                  style={{ maxWidth: "450px", width: "100%", margin: "auto" }}
                >
                  <Image src={IllistartionOne} />
                </div>
              </div>
              <div className=" relative p-10  md:p-10 mx-auto justify-center  w-full    lg:w-[80%]">
                <div>
                  <h1 className="text-center m-4">Log in To your Account</h1>
                  {Errors !== null || isExistErrors(formik.errors) ? (
                    <div
                      className={styles.errorMsg}
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
                        <li>{Errors}</li>

                        <li> {formik.errors.email}</li>

                        <li> {formik.errors.password}</li>
                      </ul>
                    </div>
                  ) : null}

                  <div className=" ">
                    <form onSubmit={formik.handleSubmit}>
                      <div style={{ marginTop: "15px" }}>
                        <label htmlFor="email">Email</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your-email@mail.com"
                          className={styles.field}
                          onChange={formik.handleChange}
                          value={formik.values.email}
                        />
                      </div>
                      <div style={{ marginTop: "15px" }}>
                        {" "}
                        <label htmlFor="password">Password</label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          className={styles.field}
                          onChange={formik.handleChange}
                          value={formik.values.password}
                        />{" "}
                      </div>
                      <div className="mt-8   flex justify-center  items-center  m-auto">
                        <button
                          disabled={loading}
                          type="submit"
                          className={
                            loading
                              ? styles.buttonDisabled
                              : styles.buttonActive
                          }
                        >
                          {loading ? (
                            <div className="lds-ring">
                              <div></div>
                            </div>
                          ) : (
                            " Log In"
                          )}{" "}
                        </button>
                      </div>{" "}
                      <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <Link href="/forget-password">
                          <a style={{ fontSize: "14px" }} className="text-blue">
                            Forgot password?
                          </a>
                        </Link>
                      </div>
                    </form>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        borderBottom: "1px solid black",
                        textAlign: "center",
                      }}
                    ></div>
                    <div className="mt-8   flex justify-center  items-center  m-auto">
                      <Link href="/signup">
                        <a
                          style={{ fontSize: "14px" }}
                          className={styles.buttonSignup}
                        >
                          Create Account
                        </a>
                      </Link>
                    </div>
                    {/* <Formik
                      initialValues={{
                        email: "",
                        password: "",
                      }}
                      validate={(values) => {
                        let errors: any = {};
                        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
                        if (!values.email) {
                          errors.email = "Cannot be blank";
                        } else if (!regex.test(values.email)) {
                          errors.email = "Invalid email format";
                        }
                        if (!values.password) {
                          errors.password = "Cannot be blank";
                        } else if (values.password.length < 7) {
                          errors.password =
                            "Password must be more than 7 characters";
                        }
                        return errors;
                      }}
                      onSubmit={login}
                    >
                      <Form>
                        <div>
                          <label className={styles.label} htmlFor="Email">
                            Email
                          </label>
                          <Field
                            className={styles.field}
                            id="email"
                            name="email"
                            placeholder="Amana@mail.com"
                          />
                          <ErrorMessage
                            component="a"
                            className={styles.errorMsg}
                            name="email"
                          />
                        </div>
                        <div>
                          <label className={styles.label} htmlFor="passowrd">
                            Password
                          </label>
                          <Field
                            className={styles.field}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                          />
                          <ErrorMessage
                            component="a"
                            className={styles.errorMsg}
                            name="password"
                          />
                        </div>
                        <div className="mt-8   flex justify-center  items-center  m-auto">
                          <button
                            disabled={true}
                            type="submit"
                            className={styles.buttonActive}
                          >
                            Login
                          </button>
                        </div>
                      </Form>
                    </Formik> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
