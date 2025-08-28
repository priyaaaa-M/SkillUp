import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses'
import RenderTotalAmount from './RenderTotalAmount'

export default function Cart() {
      const { total, totalItems } = useSelector((state) => state.cart)

      return (
            <div className="p-4 text-white">
                  <h1 className="text-2xl font-bold mb-2">Your Cart</h1>
                  <p className="mb-4">{totalItems} Course(s) in Cart</p>

                  {total > 0 ? (
                        <div className="space-y-4">
                              <RenderCartCourses />
                              <RenderTotalAmount />
                        </div>
                  ) : (
                        <p>Your cart is empty</p>
                  )}
            </div>
      )
}
