// import { LogIn, UserPlus } from "lucide-react"
import { LogIn } from "lucide-react"
import { Link } from "react-router-dom"
export default function Login(){
    return(
        <div className="form-parent">
            <div className="form-child">
                <LogIn className=" form-icon" size={50}/>
                <h2 className="form-title">Sign in to your account</h2>
                <div style={{marginBottom:"30px"}}>
                    <span>Or</span>
                    <Link to={"/register"}>create a new account</Link>
                </div>
                <form>
                    <input type="email" placeholder="Email address"/>
                    <input type="password" placeholder="Password"/>
                    <div style={{display:"flex", justifyContent:"space-between", fontSize:"14px"}}>
                        <div><input type="checkbox"/>Remember me</div>
                        <a style={{color:"rgb(130, 123, 255)", fontWeight:"500"}}>Forgot your password?</a>
                    </div>
                    <button>Sign in</button>
                </form>
            </div>
        </div>
    )
}