import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./Signin.css";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // REMEMBER ME
  // =========================
  const handleRememberMe = (e) => {
    const checked = e.target.checked;

    setRememberMe(checked);

    if (checked) {
      alert("Remember me is enabled. You will stay signed in.");
    } else {
      alert("Remember me is disabled.");
    }
  };

  // =========================
  // NORMAL SIGN IN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const enteredEmail = email.trim().toLowerCase();

    try {
      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      const user = registeredUsers.find(
        (user) => user.email?.trim().toLowerCase() === enteredEmail,
      );

      if (!user) {
        alert("This email is not registered. Please create an account first.");
        return;
      }

      if (user.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
      }

      loginUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // COMMON LOGIN FUNCTION
  // =========================
  const loginUser = (user) => {
    const accessToken =
      "user-" + Date.now() + "-" + Math.random().toString(36).substring(2);

    const loggedInUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    if (rememberMe) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    } else {
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    }

    alert("Sign in successful!");

    console.log("Logged in user:", loggedInUser);
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decodedUser = jwtDecode(credentialResponse.credential);

      const googleEmail = decodedUser.email;
      const googleFirstName = decodedUser.given_name || "";
      const googleLastName = decodedUser.family_name || "";

      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      // Check existing user
      let existingUser = registeredUsers.find(
        (user) =>
          user.email?.trim().toLowerCase() === googleEmail.trim().toLowerCase(),
      );

      // =========================
      // NEW GOOGLE USER
      // =========================
      if (!existingUser) {
        existingUser = {
          id: Date.now(),
          firstName: googleFirstName,
          lastName: googleLastName,
          email: googleEmail,
          googleUser: true,
        };

        registeredUsers.push(existingUser);

        localStorage.setItem(
          "registeredUsers",
          JSON.stringify(registeredUsers),
        );
      }

      // =========================
      // LOGIN
      // =========================
      loginUser({
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
      });
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google sign in failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    alert("Google sign in failed. Please try again.");
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-header">
          <h1>Sign in</h1>

          <p>
            Don't have an account?
            <button type="button">Create account</button>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password">Password</label>

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* REMEMBER ME */}
          <div className="form-options">
            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMe}
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                alert("Password reset functionality will be available soon.")
              }
            >
              Forgot password?
            </button>
          </div>

          {/* SIGN IN */}
          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* DIVIDER */}
          <div className="divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          {/* GOOGLE LOGIN */}
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Google Login Failed")}
            />
          </div>
        </form>

        <p className="terms">
          By continuing, you agree to our
          <span> Terms of Service</span> and
          <span> Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
