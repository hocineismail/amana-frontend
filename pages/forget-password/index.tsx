import React, { useState } from "react";

import Layout from "../../components/layout/Layout";
import Image from "next/image";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import IllistartionOne from "../../public/images/undraw_forgot_password_re_hxwm.svg";
import {
  app,
  //  appCheck
} from "../../firebase/firebase";

import Router from "next/router";
import Head from "next/head";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";
import Link from "next/link";

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

  React.useEffect(() => {
    // if no accessToken was found,then we redirect to "/" page.
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
      setErrors(null);
      const auth = getAuth();
      sendPasswordResetEmail(auth, values.email)
        .then(() => {
          swalWithBootstrapButtons.fire(
            "Great!",
            "We have sent an email to change your password, ",
            "success"
          );
        })
        .catch((e) => {
          setErrors("this Account is not exist");
        });
    },
  });
  function isEmptyObject(obj: unknown) {
    return JSON.stringify(obj) === "{}";
  }
  function isExistErrors(obj: any) {
    if (!isEmptyObject(obj)) {
      if (obj.email !== "") return true;
      return false;
    }
  }
  if (!allowPage) return <div>Loading...</div>;
  return (
    <>
      <Head>
        <title> Forget password | Asmana transferts </title>
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
                      <div>
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
                      <div className="mt-8   flex justify-center  items-center  m-auto">
                        <button type="submit" className={styles.buttonActive}>
                          Send link
                        </button>
                      </div>{" "}
                      <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <Link href="/login">
                          <a style={{ fontSize: "14px" }} className="text-blue">
                            Login
                          </a>
                        </Link>
                      </div>
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
