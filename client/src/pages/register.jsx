import { UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../component/input";
import Button from "../component/button";
import Toast from "../component/alert";

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alertData, setAlertData] = useState(null);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setAlertData({ type: "error", title: "Unequal Passwords", description: "Passwords do not match." });
      return;
    }

    if (!user.email.includes("@")) {
      setAlertData({ type: "error", title: "Invalid Email", description: "Please enter a valid email." });
      return;
    }

    if (user.password.length < 6) {
      setAlertData({ type: "error", title: "Weak Password", description: "Password must be at least 6 characters." });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const isEmailExist = users.some((u) => u.email === user.email);

    if (isEmailExist) {
      setAlertData({ type: "error", title: "Email Exists", description: "This email is already registered." });
      return;
    }

    const updatedUsers = [...users, user];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setAlertData({ type: "success", title: "Registered Successfully 🎉", description: "Redirecting to login..." });

    setTimeout(() => {
      navigate("/login");
    }, 2000);
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
        <UserPlus className="form-icon" size={50} />
        <h2 className="form-title">Create your account</h2>
        <div style={{ marginBottom: "30px" }}>
          <span>Already have an account?</span>
          <Link to={"/login"}>Sign in</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <Input type="text" name="fullName" placeholder="Full name" value={user.fullName} onChange={handleChange} />
          <Input type="email" name="email" placeholder="Email address" value={user.email} onChange={handleChange} />
          <Input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} />
          <Input type="password" name="confirmPassword" placeholder="Confirm password" value={user.confirmPassword} onChange={handleChange} />
          <Button type="submit">Create account</Button>
        </form>
      </div>
    </div>
  );
}
