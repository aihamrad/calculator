const Button = ({text, className, onClick}) => {
    return (
        <button onClick={() => onClick(text)} className={`${className} button text-center mr-s`}>{text}</button>
    )
}
export default Button