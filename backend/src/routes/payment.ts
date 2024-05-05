import express from 'express'
import { deleteUser, getAllUsers, getUser, newUser } from '../controllers/user.js'
import { adminOnly } from '../middlewares/auth.js'
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from '../controllers/payment.js'

const app = express.Router()

// route -> .../api/v1/payment/discount
app.get("/discount", applyDiscount)

// route -> .../api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon)

// route -> .../api/v1/coupon/all
app.get("/coupon/all", adminOnly, allCoupons)

// route -> .../api/v1/coupon/:id
app.delete("/coupon/:id", adminOnly, deleteCoupon)

export default app