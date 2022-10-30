import React, { useState } from "react";

import Layout from "../../components/layout/Layout";
import Image from "next/image";
import {
  getAuth,
  signInWithEmailAndPassword,
  confirmPasswordReset,
} from "firebase/auth";
import IllistartionOne from "../../public/images/undraw_secure_login_pdn4.svg";
import {
  app,
  //  appCheck
} from "../../firebase/firebase";

import Router, { useRouter } from "next/router";
import Head from "next/head";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";

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
};

const swalWithBootstrapButtons = Swal.mixin({
  allowOutsideClick: false,
  showCancelButton: false,
  showConfirmButton: false,
  timer: 3000,
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
export default function Login() {
  const [allowPage, setAllowPage] = React.useState(false);
  const [Errors, setErrors] = useState<String | null>(null);
  const router = useRouter();

  const { oobCode, mode } = router.query;
  React.useEffect(() => {
    // if no accessToken was found,then we redirect to "/" page.
    if (!localStorage.getItem("isAuth")) {
      setAllowPage(true);
    } else {
      Router.push("/");
    }
  }, []);

  const validationSchema = yup.object({
    password: yup
      .string()
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setErrors(null);
      const auth = getAuth();
      const actionCode: any = oobCode;
      confirmPasswordReset(auth, actionCode, values.password)
        .then(() => {
          swalWithBootstrapButtons
            .fire(
              "Great!",
              "You password have been updated succesfully ",
              "success"
            )
            .then(() => {
              router.push("/login");
            });
        })
        .catch((error) => {
          swalWithBootstrapButtons
            .fire(
              "Oooops!",
              "Something wrong or this link is expired please if you want to reset your password go to reset password",
              "error"
            )
            .then(() => {
              router.push("/forget-password");
            });
          // Error occurred during confirmation. The code might have expired or the
          // password is too weak.
        });
    },
  });
  console.log(formik.isValid);
  if (!allowPage) return <div>Loading...</div>;
  return (
    <>
      <Head>
        <title> Reset Passowrd | Amana - أمانة </title>
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
                  <h1 className="text-center m-4">Reset your password</h1>

                  <span className={styles.errorMsg}>
                    <ul>
                      <li>{Errors}</li>
                      <li> {formik.errors.password}</li>
                    </ul>
                  </span>
                  <div className=" ">
                    <form onSubmit={formik.handleSubmit}>
                      <div>
                        <label htmlFor="email">password</label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="************"
                          className={styles.field}
                          onChange={formik.handleChange}
                          value={formik.values.password}
                        />
                      </div>
                      {/* <div>
                        <label htmlFor="password">Confirm password</label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="************"
                          className={styles.field}
                          onChange={formik.handleChange}
                          value={formik.values.password}
                        />
                      </div> */}
                      <div className="mt-8   flex justify-center  items-center  m-auto">
                        <button type="submit" className={styles.buttonActive}>
                          Reset Password
                        </button>
                      </div>{" "}
                    </form>
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
