/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Navigate } from "../../Libraries/Libraries";
import "../Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
const SignInForm = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [gotoHome, setgottoHome] = useState(false);
  if (gotoHome) {
    return <Navigate to="/home" />;
  }
  const handleChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value,
    });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const { email, password } = state;
    const storedUsers = JSON.parse(localStorage.getItem("signUps")) || [];
    const user = storedUsers.find(
      (user) =>
        user.email === email && user.password === password && user.requestStatus
    );
    if (user) {
      setgottoHome(true);
      setState({
        email: "",
        password: "",
      });
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid credentials or account not approved.");
    }
  };
  const setCookie = (name, value) => {
    document.cookie = `${name}=${value};path=/`;
    document.cookie;
  };

  return (
    <div className="form-container sign-in-container">
      <h1 className="welcome">Welcome to GenepowerX</h1>
      <div className="form_log">
        <div>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              // Decode the id_token to extract user information
              const decodedToken = jwtDecode(credentialResponse.credential);

              // Extract email from decoded token
              const email = decodedToken.email;
              email;

              if (email) {
                setCookie("accessToken", credentialResponse.credential); // Expires in 7 days
                setCookie("email", email); // Expires in 7 days
                credentialResponse;
                if (email.endsWith("gmail.com")) {
                  setgottoHome(true);
                } else {
                  ("Email domain is not allowed.");
                }
              } else {
                ("Unable to extract email from credentialResponse");
              }
            }}
            onError={() => {
              ("Login Failed");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
