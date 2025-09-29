import express from "express";
import {
  deleteNewsletter,
  getNewsLetters,
  getSingleNewsletter,
  sendMessageToMail,
  submitNewsLetter,
} from "../controllers/newsLetterController";
import userAuth from "../middlewares/authMiddleware";

const routes = express.Router();

routes.post("/subscribe", submitNewsLetter);
routes.get("/subscribers", userAuth, getNewsLetters);
routes.get("/subscriber/:newsletterId", userAuth, getSingleNewsletter);
routes.delete("/subscriber/delete/:newsletterId", userAuth, deleteNewsletter);
routes.post("/message", userAuth, sendMessageToMail);

export default routes;
