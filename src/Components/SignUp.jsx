import React, { useState } from "react";
import "./Signup.css";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("Please agree to the Terms and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const nameParts = name.trim().split(/\s+/);

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "User";

    const enteredEmail = email.trim().toLowerCase();

    try {
      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      const emailExists = registeredUsers.some(
        (user) => user.email?.trim().toLowerCase() === enteredEmail,
      );

      if (emailExists) {
        alert("This email is already registered. Please use another email.");
        return;
      }

      const response = await axios.post(
        "https://dummyjson.com/users/add",
        {
          firstName: firstName,
          lastName: lastName,
          email: enteredEmail,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Signup Successfully:", response.data);

      registeredUsers.push({
        firstName: firstName,
        lastName: lastName,
        email: enteredEmail,
        password: password,
      });

      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

      alert("Sign Up successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreeTerms(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "https://www.google.com/";
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Sign Up</h1>

          <p>
            Already have an account?
            <button type="button">Sign in</button>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <div className="signup-password-header">
              <label htmlFor="password">Password</label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <div className="signup-password-header">
              <label htmlFor="confirmPassword">Confirm password</label>

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <label className="signup-terms">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />

            <span>
              I agree to the <strong>Terms of Service</strong> and{" "}
              <strong>Privacy Policy</strong>.
            </span>
          </label>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div className="signup-divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <button
            type="button"
            className="signup-google"
            onClick={handleGoogleSignup}
          >
            <span className="signup-google-icon">G</span>

            <span>Continue with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
