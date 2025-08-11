import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "./AuthForm.css";

const provider = new GoogleAuthProvider();

export default function AuthForm() {
  const navigate = useNavigate(); // ✅ navigation hook

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      resetForm();
      navigate("/profile"); // ✅ redirect
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      resetForm();
      setIsLogin(true);
      navigate("/profile"); // ✅ redirect
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      alert("Google sign-in successful!");
      resetForm();
      navigate("/profile"); // ✅ redirect
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Welcome to Portfolio Builder</h1>
          <p>{isLogin ? "Login to build your amazing portfolio" : "Create your account"}</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                id="loginEmail"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="divider">or</div>

            <button
              type="button"
              className="btn btn-google"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google Logo"
              />
              Login with Google
            </button>

            <div className="form-footer">
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => {
                    setIsLogin(false);
                    resetForm();
                  }}
                >
                  Sign up
                </button>
              </p>
              <p>
                <a href="#">Forgot password?</a>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="signupUsername">Username</label>
              <input
                type="text"
                id="signupUsername"
                className="form-control"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signupEmail">Email</label>
              <input
                type="email"
                id="signupEmail"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input
                type="password"
                id="signupPassword"
                className="form-control"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="divider">or</div>

            <button
              type="button"
              className="btn btn-google"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google Logo"
              />
              Sign up with Google
            </button>

            <div className="form-footer">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => {
                    setIsLogin(true);
                    resetForm();
                  }}
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
