import NewsLetter from "../models/newsLetterModal";
import { sendNewsletterMessages } from "../utils/bookCallMail";
import CustomError from "../utils/customError";

//submit newsletter
export const submitNewsLetter = async (body: { email: string }) => {
  const { email } = body;
  const existingSubscription = await NewsLetter.findOne({ email });
  if (existingSubscription) {
    throw new CustomError(
      "This email is already subscribed to the newsletter.",
      400
    );
  }
  const newSubscription = await NewsLetter.create({ email });
  return newSubscription;
};

// get newsletters
export const getNewsLetters = async (
  limit: number,
  page: number,
  sort: string,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const query: any = {};
  const sortOrder = sort == "newest" ? -1 : 1;
  if (search) {
    query.$or = [{ email: { $regex: search, $options: "i" } }];
  }
  const letters = await NewsLetter.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });
  const total = await NewsLetter.countDocuments(query);
  return { letters, page, totalPages: Math.ceil(total / limit) };
};

// get single newsletter
export const getSingleNewsLetter = async (newsletterId: string) => {
  if (!newsletterId) throw new CustomError("Newsletter id not provided", 400);
  const letter = await NewsLetter.findById(newsletterId);
  return letter;
};

// delete newsletter
export const deleteNewsLetter = async (newsletterId: string) => {
  if (!newsletterId) throw new CustomError("Newsletter id not provided", 400);
  await NewsLetter.findByIdAndDelete(newsletterId);
};

//send message to mail
export const sendMessageToMail = async ({
  emails,
  subject,
  message,
}: {
  emails: string[];
  subject: string;
  message: string;
}) => {
  await sendNewsletterMessages({
    emails,
    subject,
    message,
  });
};
