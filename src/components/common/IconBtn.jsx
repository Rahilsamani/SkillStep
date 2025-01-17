export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900
              ${
                outline
                  ? "border border-blue-50 bg-transparent"
                  : "bg-blue-50"
              } ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span className={`${outline && "text-blue-50"}`}> {text} </span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}
