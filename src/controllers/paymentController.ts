import config from "../config/config";
import User from "../models/userModel";
import catchAsync from "../utils/cathAsync";
import CustomError from "../utils/customError";
import { postReq } from "../services/ccAvenueService";
import { v4 as uuidv4 } from "uuid";
import qs from "querystring";
import { decrypt } from "../utils/ccAvenue";

//request
export const initiatePayment = catchAsync(async (req, res) => {
  const { price, itemType, itemName } = req.body;
  const userId = req.user!._id;

  if (
    price == null ||
    isNaN(Number(price)) ||
    itemType.trim() === "" ||
    typeof itemType !== "string"
  ) {
    throw new CustomError("Price or item type is not valid", 400);
  }

  const redirect_URL = `https://mentoons-backend-zlx3.onrender.com/api/v1/payment/ccavenue-response?userId=${encodeURIComponent(
    userId
  )}`;

  const user = await User.findById(userId);

  const ccAvenueParams = {
    merchant_id: config.CCAVENUE_MERCHANT_ID,
    order_id: `ORDER-${Date.now()}-${uuidv4().slice(0, 8)}`,
    currency: "INR",
    amount: price.toString(),
    redirect_url: redirect_URL,
    cancel_url: redirect_URL,
    language: "EN",
    billing_name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
    billing_email: user?.email,
    billing_tel: "",
    merchant_param1: `${itemType}_${itemName}`,
  };

  const paramString = Object.entries(ccAvenueParams)
    .map(([key, val]) => `${key}=${encodeURIComponent(val ?? "")}`)
    .join("&");

  req.ccavenueParams = paramString;
  postReq(req, res);
});

//response
export const paymentResponseHandling = catchAsync(async (req, res) => {
  const userId = req.query.userId;

  let rawString = Buffer.isBuffer(req.body)
    ? req.body.toString()
    : typeof req.body === "object"
    ? qs.stringify(req.body)
    : req.body || "";

  const parsedData = qs.parse(rawString);
  const ccavEncResponse = parsedData.encResp;

  if (!ccavEncResponse || typeof ccavEncResponse !== "string") {
    throw new CustomError("Invalid encrypted response", 400);
  }

  const decryptedResponse = decrypt(
    ccavEncResponse,
    config.CCAVENUE_WORKING_KEY
  );
  console.log("Decrypted Response:", decryptedResponse);

  const responseObject: Record<string, string> = decryptedResponse
    .split("&")
    .reduce((acc, pair) => {
      const [key, value] = pair.split("=");
      acc[key] = decodeURIComponent(value || "");
      return acc;
    }, {} as Record<string, string>);

  const merchant_param = responseObject.merchant_param1 ?? "";
  const [itemType, itemName] = merchant_param.split("_");
  const orderStatus = responseObject.order_status || "UNKNOWN";

  let redirect_URL: URL;
  if (
    (itemType === "psychology" || itemType === "astrology") &&
    orderStatus === "Success"
  ) {
    redirect_URL = new URL(
      `/assessment/${itemType}/${itemName}?paid=true`,
      config.FRONTEND_URL
    );
    redirect_URL.searchParams.append("status", orderStatus);
    redirect_URL.searchParams.append("orderId", responseObject.order_id || "");
  } else if (
    (itemType === "psychology" || itemType === "astrology") &&
    orderStatus !== "Success"
  ) {
    redirect_URL = new URL("/payment-failed", config.FRONTEND_URL);
    redirect_URL.searchParams.append("type", itemType);
    redirect_URL.searchParams.append("name", itemName);
  } else {
    redirect_URL = new URL(`/payment-failed`, config.FRONTEND_URL); //change it when completed
  }

  return res.redirect(302, redirect_URL.toString());
});
