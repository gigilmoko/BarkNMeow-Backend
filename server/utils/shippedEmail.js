import nodemailer from 'nodemailer';
import { User } from '../models/user.js';

const sendEmail = async ({ email, subject, message, attachments = [] }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });

    const content = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: subject,
        html: `<p>${message}</p>`,
    }

    await transporter.sendMail(content);
};

export const shippedEmail = async (order) => {
    const user = await User.findOne(order.user);

    await sendEmail({
        email: user.email,
        subject: `Order shipped.`,
        message: `
        <!DOCTYPE html>
        <html>
        
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Order Receipt</title>
            <style>
                /* Global Styles */
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Quicksand', sans-serif;
                    background-color: #ffffff;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
        
                h1, h2, h3, h4, h5, h6, p {
                    margin-top: 0;
                    margin-bottom: 0;
                }
        
                /* Container Styles */
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
        
                /* Header Styles */
                .header {
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    color: #343434;
                    text-align: center;
                }
        
                /* Content Styles */
                .content {
                    font-size: 16px;
                    line-height: 24px;
                    color: #888888;
                }
        
                .content p {
                    margin-bottom: 15px;
                }
        
                /* Table Styles */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
        
                table, th, td {
                    border: 1px solid #eeeeee;
                }
        
                th, td {
                    padding: 10px;
                    text-align: left;
                    vertical-align: top;
                }
        
                th {
                    background-color: #e5a927;
                    color: #ffffff;
                }
        
                /* Button Styles */
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #e5a927;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
        
                /* Footer Styles */
                .footer {
                    font-size: 14px;
                    text-align: center;
                    color: #ffffff;
                    background-color: #e5a927;
                    padding: 10px 0;
                    border-radius: 5px;
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <h2 class="header">Order Receipt - <span style="color: #e5a927;">${order.id}</span></h2>
                <br/>
                <div class="content">
                    <p>Dear ${user.name},</p>
                    <p>We are delighted to confirm that the seller has shipped out your order.</p>
                </div>
                <table>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                    </tr>
                    ${order.orderItems.map((item) => `
                    <tr>
                        <td><img src="${item.image}" alt="${item.name}" style="max-width: 100px;"></td>
                        <td>${item.quantity}</td>
                        <td>₱ ${item.price}</td>
                        <td>₱ ${item.quantity * item.price}</td>
                    </tr>
                    `).join("")}
                </table>
                <table>
                    <tr>
                        <td colspan="3" style="text-align: right;">SubTotal</td>
                        <td>₱ ${order.totalAmount}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: right;">Shipping Fee</td>
                        <td>₱ ${order.shippingCharges}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: right;">Tax</td>
                        <td>₱ ${order.taxPrice}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: right;"><b>Total Amount</b></td>
                        <td><b>₱ ${order.totalAmount + order.taxPrice}</b></td>
                    </tr>
                </table>
                <div class="content">
                <p>We appreciate you choosing Bark 'n Meow for your pet needs. Wishing you and your furry companions many moments of joy with your new goodies!</p>
            </div>
                <p>Love,<br/>Bark 'n Meow Team</p>
            </div>
        </body>
        </html>
            `,
        attachments: [
            {
                filename: 'receipt.pdf',
                path: 'temp.pdf'
            }
        ]
    }
    );
};