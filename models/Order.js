import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import randomstring from "randomstring";

const orderSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String },
        cart: { type: Array },
        checkoutTotal: { type: Number, required: true },
        orderNumber: { 
            type: String,
            default: () => randomstring.generate({
                length: 12,
                charset: 'numeric',
            }),
        },
        paymentReceived: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        collection: "orders",
    }
);


orderSchema.statics.createOrder = async function (orderDetails) {
    const { name, email, phoneNumber, cart, checkoutTotal, paymentReceived } = orderDetails;
    try {
        const order = await this.create({ name, email, phoneNumber, cart, checkoutTotal, paymentReceived });
        return order;
    } catch (err) {
        console.log('this error is while creating an order ', err);
        throw err;
    }
};

orderSchema.statics.getByOrderNumber = async function (orderNumber) {
    try {
        const order = await this.find({ orderNumber });
        return order;
    } catch (err) {
        console.log('this error is while creating an order ', err);
        throw err;
    }
};


orderSchema.statics.deleteOrder = async function (orderNumber) {
    try {
        const order = await this.remove({ orderNumber });
        return order;
    } catch (err) {
        console.log('this error occurred while deleting the order ', err);
        throw err;
    }
}


export default mongoose.model("Order", orderSchema);
