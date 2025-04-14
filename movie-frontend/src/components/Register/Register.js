import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="register-page">
      <div className="left-side" />
      <div className="right-side">
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(3, "Name must be at least 3 characters")
              .required("Name is required"),
            email: Yup.string()
              .email("Invalid email")
              .required("Email is required"),
            password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                "Must include 1 number & 1 special character"
              )
              .required("Password is required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setErrorMessage("");
            setSuccessMessage("");

            try {
              await axios.post("http://localhost:5000/users/register", values);
              setSuccessMessage("✅ Registration successful! Redirecting...");
              setTimeout(() => navigate("/login", { replace: true }), 2000);
            } catch (error) {
              setErrorMessage(
                error.response?.data?.error ||
                  "❌ Registration failed. Please try again."
              );
            }

            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="register-form">
              <h2>📝 Register</h2>

              <Field
                type="text"
                name="name"
                placeholder="👤 Name"
                className="input-field"
              />
              <ErrorMessage name="name" component="div" className="error" />

              <Field
                type="email"
                name="email"
                placeholder="📧 Email"
                className="input-field"
              />
              <ErrorMessage name="email" component="div" className="error" />

              <Field
                type="password"
                name="password"
                placeholder="🔒 Password"
                className="input-field"
              />
              <ErrorMessage name="password" component="div" className="error" />

              {errorMessage && <div className="error">{errorMessage}</div>}
              {successMessage && <div className="success">{successMessage}</div>}

              <button
                type="submit"
                className="register-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "🔄 Registering..." : "🚀 Register"}
              </button>

              <p className="login-link">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
