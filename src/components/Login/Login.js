import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For API requests
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/movies");
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          password: Yup.string()
            .min(6, "Password too short")
            .required("Password is required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setIsLoading(true);
          setErrorMessage(""); // Clear previous errors

          try {
            const response = await axios.post(
              "http://localhost:5000/users/login",
              values
            );
            localStorage.setItem("token", response.data.token);
            navigate("/movies");
          } catch (error) {
            setErrorMessage(error.response?.data?.error || "Login failed");
          }

          setIsLoading(false);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <h2>🔑 Login</h2>

            <Field
              type="email"
              name="email"
              placeholder="📧 Email"
              className="input-field"
            />
            <ErrorMessage name="email" component="div" className="error" />

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

            <p className="register-link">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="register-btn"
              >
                Register Here
              </button>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}
