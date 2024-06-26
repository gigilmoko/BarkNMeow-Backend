import { asyncError } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { stripe } from "../server.js";
import ErrorHandler from "../utils/error.js";
import { preparingTemplate, shippedTemplate, deliveredTemplate } from "../utils/emailHTMLTemplate.js";
import { sendEmail } from "../utils/features.js";
import { receiptEmail } from '../utils/receiptEmail.js';
import { shippedEmail } from '../utils/shippedEmail.js';
import { deliveredEmail } from '../utils/deliveredEmail.js';

export const processPayment = asyncError(async (req, res, next) => {
  const { totalAmount } = req.body;

  const { client_secret } = await stripe.paymentIntents.create({
    amount: Number(totalAmount * 100),
    currency: "inr",
  });

  res.status(200).json({
    success: true,
    client_secret,
  });
});

export const createOrder = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  // Check product stock before creating the order
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock for one or more items",
      });
    }
  }

  const order = await Order.create({
    user: req.user._id,
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  });

  // Update product stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    await product.save();
  }

  // try {
  //   await sendEmail("Order Preparing", req.user.email, preparingTemplate(order));
  // } catch (error) {
  //   console.error("Error sending email:", error);
  // }

  await receiptEmail(order);

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
  });
});

export const getAdminOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({});

  res.status(200).json({
    success: true,
    orders,
  });
});

export const getMyOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

export const getOrderDetails = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  res.status(200).json({
    success: true,
    order,
  });
});

// export const proccessOrder = asyncError(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);
//   if (!order) return next(new ErrorHandler("Order Not Found", 404));

//   if (order.orderStatus === "Preparing") {
//     order.orderStatus = "Shipped";
    
//     try {
//       await sendEmail("Order Shipped", req.user.email, shippedTemplate(order));
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }

//   } else if (order.orderStatus === "Shipped") {
//     order.orderStatus = "Delivered";
//     order.deliveredAt = new Date(Date.now());

//     try {
//       await sendEmail("Order Delivered", req.user.email, deliveredTemplate(order));
//     } catch (error) {
//       console.error("Error sending email:", error);

//     }

//   } else {
//     return next(new ErrorHandler("Order Already Delivered", 400));
//   }

//   await order.save();

//   res.status(200).json({
//     success: true,
//     message: "Order Processed Successfully",
//   });
// });

// PIE CHART

export const proccessOrder = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  const newStatus = req.body.status; // Get the new status from the request body

  if (newStatus === "Shipped" && order.orderStatus === "Preparing") {
    order.orderStatus = newStatus;
    
    try {
      await shippedEmail(order);;
    } catch (error) {
      console.error("Error sending email:", error);
    }

  } else if (newStatus === "Delivered" && order.orderStatus === "Shipped") {
    order.orderStatus = newStatus;
    order.deliveredAt = new Date(Date.now());

    try {
      await deliveredEmail(order);
    } catch (error) {
      console.error("Error sending email:", error);
    }

  } else {
    return next(new ErrorHandler("Invalid Status Update", 400));
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order Processed Successfully",
  });
});

export const getOrderDetailsCount = asyncError(async (req, res, next) => {
  console.log('Received request:', req);
  const orderDetails = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  console.log(orderDetails);
  const response = orderDetails.map(detail => ({
    status: detail._id,
    count: detail.count,
  }));

  res.status(200).json({
    success: true,
    orderDetails: response,
  });
});

/* export const getOrdersCountByDay = asyncError(async (req, res, next) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const ordersCountByProduct = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfToday, $lte: endOfToday }
      }
    },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalAmount: { $sum: "$orderItems.price" }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productData"
      }
    },
    { $unwind: "$productData" },
    {
      $project: {
        _id: "$productData.name",
        totalAmount: 1
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    ordersCountByProduct,
  });
});
 */
//for pie chart
/* export const getOrderedProductsCountByCategory = asyncError(async (req, res, next) => {
  const productsCountByCategory = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "productInfo"
      }
    },
    { $unwind: "$productInfo" },
    {
      $lookup: {
        from: "categories",
        localField: "productInfo.category",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    { $unwind: "$categoryInfo" },
    {
      $group: {
        _id: "$categoryInfo.category",
        count: { $sum: "$orderItems.quantity" }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);


res.status(200).json({
    success: true,
    productsCountByCategory,
  });
}); */

//line chart
export const getOrdersSumByMonth = async (req, res) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: threeMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalAmount: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log(orders);

    res.status(200).json({
      success: true,
      ordersSumByMonth: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the orders sum by month.'
    });
  }
};

//Bar chart
export const getMostOrderedProduct = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const mostOrderedProduct = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }
        }
      },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          count: { $sum: "$orderItems.quantity" }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          name: "$product.name",
          count: 1
        }
      },
      {
        $limit: 3
      }
    ]);

    console.log(mostOrderedProduct);
    res.status(200).json({
      success: true,
      mostOrderedProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the most ordered product.'
    });
  }
};
