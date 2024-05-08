import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
export const connectDB = (uri) => {
    mongoose.connect(uri, {
        dbName: "Ecommerce",
    })
        .then((c) => console.log(`DB connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = async ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));
        // const productIds = await Product.distinct("_id")
        // productIds.forEach(eachId => {
        //     productKeys.push(`product-${eachId}`)
        // })
        myCache.del(productKeys);
    }
    if (order) {
        const ordersKeys = [
            "all-orders",
            `my-order-${userId}`,
            `order-${orderId}`,
        ];
        myCache.del(ordersKeys);
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calcPercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getCategoryPercentage = async (categories, productsCount) => {
    const categoriesCountPromise = categories.map((cat) => Product.countDocuments({ category: cat }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryPercentage = [];
    categories.forEach((cat, i) => {
        categoryPercentage.push({
            [cat]: Math.round((categoriesCount[i] / productsCount) * 100)
        });
    });
    return categoryPercentage;
};
