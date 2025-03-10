// import { Phone, PhoneCall, PhoneCallIcon, PhoneForwarded, PhoneIncoming, PhoneMissed, PhoneMissedIcon, PhoneOutgoing } from "lucide-react"
import { PhoneCall, PhoneIncoming } from "lucide-react"
import userImg from"../assets/images/user.png"

export default function CallItems(){
    return(
        <>
        <div className="ChatItems">
            <div style={{display:"flex", alignItems:"center",justifyContent:"space-between", width:"95%"}}>
              <h2 style={{margin:"20px 0"}}>Calls</h2>
              {/* <Phone /> */}
              <PhoneCall size={18}/>
              {/* <PhoneIncoming/> */}
              {/* <PhoneOutgoing/> */}
              {/* <PhoneCallIcon/> */}
              {/* <PhoneForwarded/> */}
            </div>
            <input type="search" placeholder="Search or start new call"/>
            <div style={{width:"105%", height:"5px", background:"rgb(15 21 34)", marginLeft:"-5%"}}></div>
            <p style={{color:"gray", margin:"15px 0px"}}>Recent</p>
            <div className="item-parent">
                <div className="item-child" style={{justifyContent:"space-between", alignItems:"self-start"}}>
                   <div style={{display:"flex"}}>
                        <img src={userImg}/>
                        <div style={{marginLeft:"15px"}}>
                            <h4 >Eman Wael </h4>
                            <p><PhoneIncoming size={12}/><span style={{marginLeft:"5px"}}>Missed</span></p>
                        </div>
                   </div>
                   <p style={{paddingRight:"10px"}}>2/20/2025</p>
                </div>
            </div>
        </div>
        </>
    )
}