import React from "react";

const IconsButton = ({
    text,
    onClick,
    children,
    disabled = false,
    outline = false,
    customClasses = "",
    type = "button",
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}
            className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium
        ${outline ? "border border-gray-400 text-gray-700 bg-transparent" : "bg-blue-600 text-white"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
        ${customClasses}
      `}
        >
            {children && <span className="text-lg">{children}</span>}
            <span>{text}</span>
        </button>
    );
};

export default IconsButton;
