import { useState } from "react";
import axios from "axios";

export default function Auth({ onLogin }) {

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const endpoint = isLogin ? "login" : "signup";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : formData;

const API_URL = import.meta.env.VITE_API_URL;

const res = await axios.post(
  `${API_URL}/${endpoint}`,
  payload
);
      localStorage.setItem("email", formData.email);

      alert(
        res.data.message || "Success"
      );

      onLogin(formData.email);

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.detail ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>🌾 SmartAgri AI</h1>

        <p>
          AI-powered decision support system for farmers
        </p>

        <div className="auth-toggle">

          <button
            className={isLogin ? "active-auth" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "active-auth" : ""}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="auth-submit"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

        </form>

      </div>

    </div>
  );
}