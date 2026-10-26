import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Leaf,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Admin login failed. Please try again."
        );
      }

      if (!data.access_token || data.admin?.role !== "admin") {
        throw new Error("Invalid admin login response.");
      }

      sessionStorage.setItem("adminToken", data.access_token);
      sessionStorage.setItem("adminUser", JSON.stringify(data.admin));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Check whether the backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f3ec] px-4 py-10 sm:px-6">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#e8d5bf]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-[#d9c1a5]/35 blur-3xl" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#e9ded1] bg-white shadow-[0_24px_80px_rgba(77,48,28,0.12)] md:grid-cols-2">
        {/* Left brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#4b2c1e] p-10 text-white md:flex lg:p-12">
          <div className="absolute -right-24 -top-16 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-12 -top-4 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[#8a5838]/30 blur-2xl" />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                <Leaf size={25} />
              </span>

              <span>
                <span className="block font-serif text-2xl font-bold tracking-[0.14em]">
                  SPICECRAFT
                </span>
                <span className="mt-1 block text-xs tracking-wide text-[#ddc7b2]">
                  Premium Indian Spices
                </span>
              </span>
            </Link>
          </div>

          <div className="relative my-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d8b99b]">
              Store administration
            </span>

 <h1 className="mt-5 font-serif text-4xl font-bold leading-tight !text-white lg:text-5xl">
  Every spice.
  <br />
  Every detail.
  <br />
  <span className="!text-white">Under control.</span>
</h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#e2d2c4]">
              Manage your products, monitor your store, and keep every
              customer order moving smoothly.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm text-[#e6d6c8]">
              <ShieldCheck size={19} className="text-[#dfbd9d]" />
              Secure administrator access
            </div>
          </div>

          <p className="relative text-xs text-[#cbb5a2]">
            From Indian Spices to Extraordinary Meals.
          </p>
        </div>

        {/* Login form panel */}
        <div className="flex min-w-0 flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
          <Link
            to="/"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#806653] transition hover:text-[#4b2c1e]"
          >
            <ArrowLeft size={17} />
            Back to Store
          </Link>

          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4b2c1e] text-white">
              <Leaf size={25} />
            </span>
            <div>
              <p className="font-serif text-xl font-bold tracking-[0.12em] text-[#4b2c1e]">
                SPICECRAFT
              </p>
              <p className="mt-1 text-xs text-[#8b7563]">
                Premium Indian Spices
              </p>
            </div>
          </div>

          <div className="mb-7">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e6d9] text-[#75462d]">
              <ShieldCheck size={29} strokeWidth={1.8} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a16b48]">
              Welcome back
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold text-[#4b2c1e] sm:text-4xl">
              Admin Login
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#8b796c]">
              Sign in to manage your SpiceCraft store.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold text-[#54382a]"
              >
                Admin Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a18a78]"
                />

                <input
                  id="admin-email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  required
                  className="box-border h-12 w-full rounded-xl border border-[#e6d6c7] bg-[#fffdf9] pl-11 pr-4 text-sm text-[#39251d] outline-none transition placeholder:text-[#b1a195] focus:border-[#8a5838] focus:ring-4 focus:ring-[#8a5838]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-[#54382a]"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a18a78]"
                />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="box-border h-12 w-full rounded-xl border border-[#e6d6c7] bg-[#fffdf9] pl-11 pr-12 text-sm text-[#39251d] outline-none transition placeholder:text-[#b1a195] focus:border-[#8a5838] focus:ring-4 focus:ring-[#8a5838]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#927b68] transition hover:bg-[#f3e8dd] hover:text-[#4b2c1e]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4b2c1e] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#67412d] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#8a5838]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LockKeyhole size={17} />
              {loading ? "Signing in..." : "Secure Admin Login"}
            </button>
          </form>

          <div className="mt-7 flex items-start gap-3 rounded-xl border border-[#eee2d5] bg-[#fcf8f3] p-4">
            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0 text-[#8a5838]"
            />
            <div>
              <p className="text-sm font-semibold text-[#54382a]">
                Protected admin area
              </p>
              <p className="mt-1 text-xs leading-5 text-[#8b796c]">
                Authorized administrators only. Your store management
                access is restricted.
              </p>
            </div>
          </div>

          <p className="mt-7 text-center text-xs text-[#a18e7e]">
            SPICECRAFT · From Indian Spices to Extraordinary Meals
          </p>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;