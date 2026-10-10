
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserRound, LockKeyhole, ArrowLeft } from "lucide-react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Customer login backend is not connected yet.");
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <Link to="/" className="login-back">
          <ArrowLeft size={17} /> Back to Store
        </Link>

        <div className="login-icon">
          <UserRound size={28} />
        </div>

        <h1>Welcome Back!</h1>
        <p className="login-subtitle">
          Sign in to your SpiceCraft account
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="customer-email">Email Address</label>
          <input
            id="customer-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="customer-password">Password</label>
          <div className="login-password">
            <LockKeyhole size={18} />
            <input
              id="customer-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit">
            Login to Account
          </button>
        </form>

        <p className="login-note">
          Need help? Contact our customer support team.
        </p>
      </section>
    </main>
  );
}

export default Login;

