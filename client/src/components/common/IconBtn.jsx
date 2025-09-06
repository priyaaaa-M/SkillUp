import React from 'react';

const IconBtn = ({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses,
  type = 'button',
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`flex items-center gap-x-2 rounded-md py-2 px-4 font-medium ${
        outline
          ? 'border border-yellow-50 bg-transparent text-yellow-50 hover:bg-yellow-900 hover:bg-opacity-20'
          : 'bg-yellow-50 text-richblack-900 hover:bg-yellow-100'
      } disabled:cursor-not-allowed disabled:opacity-50 ${customClasses || ''}`}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default IconBtn;
