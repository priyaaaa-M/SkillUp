import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Code = () => {
    return (
        <div className="text-center text-lg text-richblack-200 leading-relaxed max-w-4xl mx-auto">
            We are passionate about revolutionizing the way we learn. Our innovative platform{" "}
            <HighlightText text="combines technology," />

            <span className="text-brown-300 font-semibold">
                {" "}expertise,
            </span>{" "}
            and community to create an{" "}
            <span className="text-brown-600 font-semibold">
                unparalleled educational experience.
            </span>
        </div>
    )
}

export default Code
