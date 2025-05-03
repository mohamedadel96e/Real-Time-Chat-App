import { NavLink } from "react-router-dom"

export default function SidebarItem({ path, children, desc }) {
    return (
        <>
            <div className="side-bar-child">
                <NavLink to={path}>
                    {children}
                    <span>{desc}</span>
                </NavLink>
            </div>
        </>
    )
}