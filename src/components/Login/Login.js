import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("auth");
    if (isAuthenticated === "true") {
      navigate("/movies");
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          password: Yup.string()
            .min(6, "Password too short")
            .required("Password is required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setIsLoading(true);
          setErrorMessage(""); // Clear previous errors

          // Simulating API authentication request
          setTimeout(() => {
            if (values.username === "admin" && values.password === "password") {
              localStorage.setItem("auth", "true");
              navigate("/movies");
            } else {
              setErrorMessage("❌ Invalid username or password.");
            }
            setIsLoading(false);
            setSubmitting(false);
          }, 1500); // Simulated network delay
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <h2>🔑 Login</h2>

            <Field
              type="text"
              name="username"
              placeholder="👤 Username"
              className="input-field"
            />
            <ErrorMessage name="username" component="div" className="error" />

            <div className="password-container">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="🔒 Password"
                className="input-field"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <ErrorMessage name="password" component="div" className="error" />

            {errorMessage && <div className="error">{errorMessage}</div>}

            <button
              type="submit"
              className="login-btn"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "🔄 Logging in..." : "🚀 Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
