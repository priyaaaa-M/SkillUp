import React from 'react'
import { useSelector } from 'react-redux'
import IconButton from "../../../common/IconsButton"

const RenderTotalAmount = () => {
    const { cart, total } = useSelector((state) => state.cart) // ✅ include cart

    const handleBuyCourses = () => {
        console.log("Bought these courses: ", cart)
        // TODO: integrate payment gateway here
    }

    return (
        <div className="p-4 border rounded-lg shadow-md bg-gray-800 text-white">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-xl mb-4">₹ {total}</p>

            <IconButton
                text="Buy Now"
                onClick={handleBuyCourses}
                customClasses="w-full justify-center"
            />
        </div>
    )
}

export default RenderTotalAmount
