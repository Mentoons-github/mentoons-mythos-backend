import mongoose from "mongoose";
import { IBooking } from "../interfaces/booking";

export interface IBookingDocument extends IBooking, Document {}
const bookingSchema = new mongoose.Schema<IBookingDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model<IBookingDocument>("Booking", bookingSchema);
export default Booking;
