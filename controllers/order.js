import OrderModel from '../models/Order.js';

const createOrder = async (req, res) => {
    console.log('starting to create the order');
    try {
      const orderDetails = req.body.orderDetails;
      const order = await OrderModel.createOrder(orderDetails);
      return res.status(200).json({ success: true, order });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }
};

const getByOrderNumber = async (req, res) => {
  try {
    const order = await OrderModel.getByOrderNumber(req.params.orderNumber);
    if (order.length > 0) {
      return res.status(200).json({ success: true, order });
    } else {
      return res.status(500).json({ success: false });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
};

const updateOrder = async (req, res) => {
    console.log('starting to update the order', req.body);
    const filter = { orderNumber: req.body.orderNumber };
    const update = { paymentReceived: true };
  
    try {
      const updatedDoc = await OrderModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      
      console.log('updated doc is here to stay ', updatedDoc);
  
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }
  };




export default {
    createOrder,
    updateOrder,
    getByOrderNumber
  };