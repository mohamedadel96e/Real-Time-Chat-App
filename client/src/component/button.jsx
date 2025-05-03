export default function Button({ type = "button", children, onClick }) {
    return (
        <>
            <button type={type} onClick={onClick} className="btn-primary">
                {children}
            </button>
        </>
    )
}