import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
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
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(
      (u) => u.email === user.email && u.password === user.password
    );

    if (foundUser) {
      setAlertData({
        type: "success",
        title: "Successful Login 🎉",
        description: `Welcome back, ${foundUser.fullName || "User"}!`,
      });

      setTimeout(() => {
        navigate("/main");
      }, 2000);
    } else {
      setAlertData({
        type: "error",
        title: "Login Failed",
        description: "Your email or password is incorrect.",
      });
    }
  };

  return (
    <div className="form-parent">
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
          <span>Or</span>
          <Link to={"/register"}>create a new account</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <Input type="email" name="email" placeholder="Email address" value={user.email} onChange={handleChange} />
          <Input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
            <div><input type="checkbox" /> Remember me</div>
            <a style={{ color: "rgb(130, 123, 255)", fontWeight: "500" }}>Forgot your password?</a>
          </div>
          <Button type="submit">Sign in</Button>
        </form>
      </div>
    </div>
  );
}
