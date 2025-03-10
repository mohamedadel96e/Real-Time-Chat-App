import { UserPlus } from "lucide-react"
import { Link } from "react-router-dom"
export default function Register(){
    return(
        <div className="form-parent">
            <div className="form-child">
                <UserPlus className=" form-icon" size={50}/>
                <h2 className="form-title">Create your account</h2>
                <div style={{marginBottom:"30px"}}>
                    <span>Already have an account?</span>
                    <Link to={"/login"}>Sign in</Link>
                </div>
                <form>
                    <input type="text" placeholder="Full name"/>
                    <input type="email" placeholder="Email address"/>
                    <input type="password" placeholder="Password"/>
                    <input type="password" placeholder="Confirm password"/>
                    <button>Create account</button>
                </form>
            </div>
        </div>
    )
}