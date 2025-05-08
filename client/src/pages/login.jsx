import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../component/input";
import Button from "../component/button";
import Toast from "../component/alert";

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [alertData, setAlertData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email format
    if (!user.email.includes("@") || !user.email.includes(".")) {
      setAlertData({ type: "error", title: "Invalid Email", description: "Please enter a valid email." });
      return;
    }

    // Validate password length
    if (user.password.length < 6) {
      setAlertData({ type: "error", title: "Invalid Password", description: "Password must be at least 6 characters." });
      return;
    }

    // Send login request to the backend
    fetch("http://localhost:5010/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || `Failed to login: ${response.status}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        document.cookie = `token=${data.token}; path=/`;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setAlertData({
          type: "success",
          title: "Successful Login 🎉",
          description: `Welcome back, Ya Wa7sh}!`,
        });
        setTimeout(() => {
          navigate("/main");
        }, 2000);
      })
      .catch((error) => {
        setAlertData({ type: "error", title: "Login Failed", description: error.message });
      });
  };

  return (
    <div className="form-parent" style={{ position: "relative" }}>
      {alertData && (
        <Toast
          type={alertData.type}
          title={alertData.title}
          description={alertData.description}
          onClose={() => setAlertData(null)}
        />
      )}
      <div className="form-child">
        <LogIn className="form-icon" size={50} />
        <h2 className="form-title">Sign in to your account</h2>
        <div style={{ marginBottom: "30px" }}>
          <span>Don't have an account? </span>
          <Link to={"/register"}>Create a new account</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <Input type="email" name="email" placeholder="Email address" value={user.email} onChange={handleChange} />
          <Input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "20px" }}>
            <div><input type="checkbox" /> Remember me</div>
            <a style={{ color: "rgb(130, 123, 255)", fontWeight: "500" }}>Forgot your password?</a>
          </div>
          <Button type="submit">Sign in</Button>
        </form>
      </div>
    </div>
  );
}