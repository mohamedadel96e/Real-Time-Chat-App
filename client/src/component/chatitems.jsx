import userImg from"../assets/images/user.png"
export default function ChatItems(){
    return(
        <>
        <div className="ChatItems">
            <div>
              <h2 style={{margin:"20px 0"}}>Chats</h2>
            </div>
            <input type="search" placeholder="Search or start new chat"/>
            <div className="item-parent">
                <div className="item-child" >
                    <img src={userImg}/>
                    <div style={{marginLeft:"15px"}}>
                        <h4 >Eman Wael </h4>
                        <p>I miss U</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}