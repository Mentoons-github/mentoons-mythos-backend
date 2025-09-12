import { IBooking } from "../interfaces/booking";
import Booking from "../models/bookCallModel";
import { BookConfirmationMail } from "../utils/bookCallMail";
import CustomError from "../utils/customError";

export const availbleSlots = async (date: string, type: string) => {
  const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
  if (!date || !type) {
    throw new CustomError("Date and Type are required", 404);
  }
  const booked = await Booking.find({ date, type }).select("time ");
  const bookedTimes = booked?.map((b) => b.time);
  const available = allSlots.filter((slot) => !bookedTimes.includes(slot));

  return { date, type, available };
};

export const bookSlot = async (datas: IBooking) => {
  const { name, email, mobileNumber, type, date, time } = datas;

  const exists = await Booking.findOne({ date, time, type });
  if (exists) {
    throw new CustomError("Slot already booked for this type", 400);
  }
  const booking = new Booking({ name, email, mobileNumber, date, time, type });
  await booking.save();
  await BookConfirmationMail({name, email, type, date, time, mobileNumber})

  return booking
};
