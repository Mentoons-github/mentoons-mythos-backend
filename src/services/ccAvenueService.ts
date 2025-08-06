import { Request, Response } from "express";
import { encrypt } from "../utils/ccAvenue";
import config from "../config/config";

export const postReq = (req: Request, res: Response) => {
  console.log("Inside post request");
  console.log("Request Body: ", req.body);

  const workingKey = config.CCAVENUE_WORKING_KEY;
  const accessCode = config.CCAVENUE_ACCESS_CODE;
  let encRequest = "";
  let formbody = "";

  const paramString = (req as any).ccavenueParams || JSON.stringify(req.body);

  try {
    if (paramString) {
      encRequest = encrypt(paramString, workingKey);

      formbody = `
        <form id="nonseamless" method="post" name="redirect"
              action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction">
          <input type="hidden" id="encRequest" name="encRequest" value="${encRequest}" />
          <input type="hidden" name="access_code" id="access_code" value="${accessCode}" />
          <script>document.forms[0].submit();</script>
        </form>
      `;

      res.status(200).send(formbody);
    } else {
      res.status(400).json({ error: "Missing parameters" });
    }
  } catch (error: any) {
    console.error("CCAvenue request error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process payment request",
      error: error.message,
    });
  }
};
