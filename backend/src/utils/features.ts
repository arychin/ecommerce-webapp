import mongoose from "mongoose"
import { InvalidateCacheProps, OrderItemType } from "../types/types.js"
import { myCache } from "../app.js"
import { Product } from "../models/products.js"
import { Order } from "../models/order.js"

export const connectDB = (uri: string) => {
    mongoose.connect(uri,{
        dbName: "Ecommerce",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e))
}


export const invalidateCache = async ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId,
}: InvalidateCacheProps) => {
    if(product){
        const productKeys: string[] = [
            "latest-products",
            "categories",
            "all-products",
        ]
        if(typeof productId === "string") productKeys.push(`product-${productId}`)
        if(typeof productId === "object")
            productId.forEach((i)=>productKeys.push( `product-${i}`))    

        // const productIds = await Product.distinct("_id")
        // productIds.forEach(eachId => {
        //     productKeys.push(`product-${eachId}`)
        // })

        myCache.del(productKeys)
    }
    if(order){
        const ordersKeys: string[] = [
            "all-orders",
            `my-order-${userId}`,
            `order-${orderId}`,
        ];
      
        myCache.del(ordersKeys);
    }
    if(admin){

    }
}


export const reduceStock = async (orderItems: OrderItemType[]) => {
    for(let i=0; i<orderItems.length; i++){
        const order = orderItems[i]
        const product = await Product.findById(order.productId)
        if(!product) throw new Error("Product Not Found")
        product.stock -= order.quantity
        await product.save()
    }
}



export const calcPercentage = (thisMonth: number, lastMonth: number) => {
    if(lastMonth===0) return thisMonth*100
    const percent = ((thisMonth - lastMonth)/lastMonth) * 100
    return Number(percent.toFixed(0))
}