import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const EyeIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
    )}
  </svg>
);

const NoteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const passwordChecks = {
    length:  formData.password.length >= 6,
    match:   formData.password === formData.confirm && formData.confirm.length > 0,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      return setError("Passwords do not match.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-root">
      <div className="reg-bg-blobs">
        <span className="reg-blob reg-blob-1" />
        <span className="reg-blob reg-blob-2" />
        <span className="reg-blob reg-blob-3" />
      </div>

      <div className="reg-card">
        {/* Left panel */}
        <div className="reg-left">
          <div className="reg-brand">
            <span className="reg-brand-icon"><NoteIcon /></span>
            <span className="reg-brand-name">NoteNest</span>
          </div>
          <div className="reg-left-body">
            <h2 className="reg-tagline">Start sharing<br />your ideas today.</h2>
            <ul className="reg-perks">
              {["Write & publish notes instantly","Organize, tag, and manage your notes effortlessly","Quickly search, filter, and access your notes"].map((p) => (
                <li key={p} className="reg-perk">
                  <span className="reg-perk-icon"><CheckIcon /></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="reg-card-dots">
            <span className="reg-dot" />
            <span className="reg-dot reg-dot-active" />
            <span className="reg-dot" />
          </div>
        </div>

        {/* Right panel */}
        <div className="reg-right">
          <div className="reg-form-header">
            <h1 className="reg-title">Create account</h1>
            <p className="reg-subtitle">Start organizing your notes smarter</p>
          </div>

          {error && (
            <div className="reg-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            <div className="reg-field">
              <label className="reg-label" htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" className="reg-input" placeholder="Jane Doe"
                value={formData.name} onChange={handleChange} required autoComplete="name" />
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" className="reg-input" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required autoComplete="email" />
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="password">Password</label>
              <div className="reg-field-wrap">
                <input id="password" name="password" type={showPassword ? "text" : "password"}
                  className="reg-input" placeholder="Min. 6 characters"
                  value={formData.password} onChange={handleChange} required />
                <button type="button" className="reg-eye" onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide" : "Show"}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {formData.password.length > 0 && (
                <div className="reg-checks">
                  <span className={`reg-check ${passwordChecks.length ? "ok" : ""}`}>
                    {passwordChecks.length ? "✓" : "○"} At least 6 characters
                  </span>
                </div>
              )}
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="confirm">Confirm password</label>
              <div className="reg-field-wrap">
                <input id="confirm" name="confirm" type={showConfirm ? "text" : "password"}
                  className="reg-input" placeholder="Repeat your password"
                  value={formData.confirm} onChange={handleChange} required />
                <button type="button" className="reg-eye" onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? "Hide" : "Show"}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {formData.confirm.length > 0 && (
                <div className="reg-checks">
                  <span className={`reg-check ${passwordChecks.match ? "ok" : "err"}`}>
                    {passwordChecks.match ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            <button type="submit" className={`reg-btn${loading ? " loading" : ""}`} disabled={loading}>
              {loading ? <span className="reg-spinner" /> : "Create account"}
            </button>
          </form>

          <p className="reg-signin-prompt">
            Already have an account?{" "}
            <Link to="/login" className="reg-signin-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
