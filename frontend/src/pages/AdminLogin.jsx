
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, LockKeyhole, ArrowLeft } from "lucide-react";
import "./Login.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Admin authentication backend is not connected yet.");
  };

  return (
    <main className="login-page">
      <section className="login-card admin-login-card">
        <Link to="/" className="login-back">
          <ArrowLeft size={17} /> Back to Store
        </Link>

        <div className="login-icon">
          <ShieldCheck size={28} />
        </div>

        <h1>Admin Login</h1>
        <p className="login-subtitle">
          Sign in to manage your SpiceCraft store
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Admin Email</label>
          <input
            id="admin-email"
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="login-password">
            <LockKeyhole size={18} />
            <input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit">
            Secure Admin Login
          </button>
        </form>

        <p className="login-note">
          Authorized administrators only.
        </p>
      </section>
    </main>
  );
}

export default AdminLogin;

