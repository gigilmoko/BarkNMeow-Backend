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

export const receiptEmail = async (order) => {
    const user = await User.findOne(order.user);

    await sendEmail({
        email: user.email,
        subject: `Your order has been placed.`,
        message: `
            <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns:v="urn:schemas-microsoft-com:vml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" />
    <!--[if !mso]--><!-- -->
    <link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
            crossorigin="anonymous" referrerpolicy="no-referrer" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
    <!--<![endif]-->

    <title>Material Design for Bootstrap</title>

    <style type="text/css">
        body {
            width: 100%;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            mso-margin-top-alt: 0px;
            mso-margin-bottom-alt: 0px;
            mso-padding-alt: 0px 0px 0px 0px;
        }

        p,
        h1,
        h2,
        h3,
        h4 {
            margin-top: 0;
            margin-bottom: 0;
            padding-top: 0;
            padding-bottom: 0;
        }

        span.preheader {
            display: none;
            font-size: 1px;
        }

        html {
            width: 100%;
        }

        table {
            font-size: 14px;
            border: 0;
        }

        /* ----------- responsivity ----------- */

        @media only screen and (max-width: 640px) {

            /*------ top header ------ */
            .main-header {
                font-size: 20px !important;
            }

            .main-section-header {
                font-size: 28px !important;
            }

            .show {
                display: block !important;
            }

            .hide {
                display: none !important;
            }

            .align-center {
                text-align: center !important;
            }

            .no-bg {
                background: none !important;
            }

            /*----- main image -------*/
            .main-image img {
                width: 440px !important;
                height: auto !important;
            }

            /* ====== divider ====== */
            .divider img {
                width: 440px !important;
            }

            /*-------- container --------*/
            .container590 {
                width: 440px !important;
            }

            .container580 {
                width: 400px !important;
            }

            .main-button {
                width: 220px !important;
            }

            /*-------- secions ----------*/
            .section-img img {
                width: 320px !important;
                height: auto !important;
            }

            .team-img img {
                width: 100% !important;
                height: auto !important;
            }
        }

        @media only screen and (max-width: 479px) {

            /*------ top header ------ */
            .main-header {
                font-size: 18px !important;
            }

            .main-section-header {
                font-size: 26px !important;
            }

            /* ====== divider ====== */
            .divider img {
                width: 280px !important;
            }

            /*-------- container --------*/
            .container590 {
                width: 280px !important;
            }

            .container590 {
                width: 280px !important;
            }

            .container580 {
                width: 260px !important;
            }

            /*-------- secions ----------*/
            .section-img img {
                width: 280px !important;
                height: auto !important;
            }
        }
    </style>
    <!--[if gte mso 9]><style type=”text/css”>
                    body {
                    font-family: arial, sans-serif!important;
                    }
                    </style>
                <![endif]-->
</head>

<body>

    <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">

        <tr>
            <td align="center">
                <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">

                    <tr>
                        <td align="center"
                            style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;"
                            class="main-header">
                            <!-- section text ======-->

                            <div style="line-height: 35px">

                                Order Confirmation - <span style="color: #e5a927;">${order.id}</span>

                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                    </tr>

                    <tr>
                        <td align="center">
                            <table border="0" width="40" align="center" cellpadding="0" cellspacing="0"
                                bgcolor="eeeeee">
                                <tr>
                                    <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                    </tr>

                    <tr>
                        <td align="left">
                            <table border="0" width="590" align="center" cellpadding="0" cellspacing="0"
                                class="container590">
                                <tr>
                                    <td align="left"
                                        style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                                        <!-- section text ======-->

                                        <p style="line-height: 24px; margin-bottom:15px;">

                                            Dear ${user.name},

                                        </p>
                                        <p style="line-height: 24px;margin-bottom:15px;">
                                            Thank you for choosing Bark 'n Meow for your recent purchase. We are
                                            delighted to confirm that your order has been received and is currently in
                                            the process of being prepared for shipment.
                                        </p>
                                        <p style="line-height: 24px; margin-bottom:20px;">
                                            We appreciate you choosing Bark 'n Meow for your pet needs. Wishing you and
                                            your furry companions many moments of joy with your new goodies!
                                        </p>
                                        <table border="0" align="center" width="180" cellpadding="0" cellspacing="0"
                                            bgcolor="#e5a927" style="margin-bottom:20px;">

                                            <tr>
                                                <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                            </tr>
                                            <div class="page-content container">
                                                <div class="page-header text-blue-d2">
                                                    <hr class="row brc-default-l1 mx-n1 mb-4" />
                                                    <h1 class="page-title text-secondary-d1 text-center">
                                                        <b class="text-600">BARK AND MEOW</b>
                                                    </h1>
                                                    <hr class="row brc-default-l1 mx-n1 mb-4" />
                                                    <div class="row">
                                                        <div class="col-sm-6">
                                                            <div>
                                                                <span class="text-sm text-grey-m2 align-middle"><b class="text-600">Name: </b></span>
                                                                <span class="text-600 text-110 text-blue align-middle">${user.name}</span>
                                                            </div>
                                                            <div>
                                                                <span class="text-sm text-grey-m2 align-middle"><b class="text-600">Address: </b></span>
                                                                <span class="text-600 text-110 text-blue align-middle">${order.shippingInfo.address} ${order.shippingInfo.city}, ${order.shippingInfo.country}, ${order.shippingInfo.pinCode} </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                        
                                                    <div class="mt-4">
                                        
                                                        <div class="row text-600 text-white bgc-default-tp1 py-25">
                                                            <div class="col-9 col-sm-5">Product</div>
                                                            <div class="d-none d-sm-block col-4 col-sm-2">Quantity</div>
                                                            <div class="d-none d-sm-block col-sm-2">Unit Price</div>
                                                            <div class="col-2">Amount</div>
                                                        </div>
                                        
                                                        <div class="text-95 text-secondary-d3">
                                                            <div class="row mb-2 mb-sm-0 py-25 bgc-default-l4">
                                                                ${order.orderItems.map((item) => `
                                                                <div class="col-9 col-sm-5"><img src="${item.image}" alt="${item.name}"
                                                                        style="max-width: 100px;"></div>
                                                                <div class="d-none d-sm-block col-2">${item.name}</div>
                                                                <div class="d-none d-sm-block col-2 text-95">₱ ${item.price}</div>
                                                                <div class="col-2 text-secondary-d2">₱ ${item.quantity}</div>
                                                                `).join("")}
                                                            </div>
                                                        </div>
                                        
                                                        <hr />
                                        
                                                        <div class="row border-b-2 brc-default-l2"></div>
                                        
                                                        <div class="row mt-3">
                                        
                                                            <div class="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0">
                                                                <b class="text-600">Order Summary: </b>
                                                            </div>
                                        
                                                            <div class="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                                                                <div class="row my-2">
                                                                    <div class="col-7 text-right">
                                                                        SubTotal
                                                                    </div>
                                                                    <div class="col-5">
                                                                        <span class="text-120 text-secondary-d1">₱ ${order.totalAmount}</span>
                                                                    </div>
                                                                </div>
                                        
                                                                <div class="row my-2">
                                                                    <div class="col-7 text-right">
                                                                        Shipping Fee
                                                                    </div>
                                                                    <div class="col-5">
                                                                        <span class="text-110 text-secondary-d1">₱ ${order.shippingCharges}</span>
                                                                    </div>
                                                                </div>
                                        
                                                                <div class="row my-2 align-items-center bgc-primary-l3 p-2">
                                                                    <div class="col-7 text-right">
                                                                        Tax
                                                                    </div>
                                                                    <div class="col-5">
                                                                        <span class="text-150 text-success-d3 opacity-2">₱ ${order.taxPrice}</span>
                                                                    </div>
                                                                </div>
                                        
                                                                <hr />
                                        
                                                                <div class="row my-2 align-items-center bgc-primary-l3 p-2">
                                                                    <div class="col-7 text-right">
                                                                        <b class="text-600">Total Amount</b>
                                                                    </div>
                                                                    <div class="col-5">
                                                                        <span class="text-150 text-success-d3 opacity-2"><b class="text-600">₱
                                                                        ${order.totalAmount + order.taxPrice}</b></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <tr>
                                                <td align="center"
                                                    style="color: #ffffff; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 22px; letter-spacing: 2px;">
                                                    <!-- main section button -->

                                                    <div style="line-height: 22px;">
                                                        <a href=""
                                                            style="color: #ffffff; text-decoration: none;">SHOP 
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                            </tr>

                                        </table>
                                        <p style="line-height: 24px">
                                            Love,</br>
                                            Bark 'n Meow Team
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
        </tr>
    </table>
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