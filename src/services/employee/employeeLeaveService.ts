import mongoose from "mongoose";
import { ILeave } from "../../interfaces/employee/attendance & leave";
import Leave from "../../models/employee/leaveModel";
import CustomError from "../../utils/customError";

// apply leave
export const applyLeave = async (employeeId: string, data: ILeave) => {
  if (!employeeId) throw new CustomError("Employee id requried", 400);
  const parsedFrom = new Date(data.fromDate);
  const parsedTo = new Date(data.toDate);
  const leaveData = await Leave.create({
    employeeId,
    leaveType: data.leaveType,
    fromDate: parsedFrom,
    toDate: parsedTo,
    reason: data.reason,
  });

  return leaveData;
};

// get leave requests
export const getEmployeeLeaveRequests = async (
  employeeId: string,
  page: number,
  limit: number,
  sort: string,
  status?: string,
  search?: string
) => {
  if (!employeeId) throw new CustomError("Employee id requried", 400);
  const objectId = new mongoose.Types.ObjectId(employeeId);
  const query: any = { employeeId: objectId };
  const skip = (page - 1) * limit;
  if (status) query.status = status;
  if (search && search.trim().length > 0) {
    const cleaned = search.trim();
    const dateSearch = new Date(cleaned);

    if (!isNaN(dateSearch.getTime())) {
      const startOfDay = new Date(dateSearch);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dateSearch);
      endOfDay.setHours(23, 59, 59, 999);

      query.$or = [
        { createdAt: { $gte: startOfDay, $lte: endOfDay } },
        { fromDate: { $gte: startOfDay, $lte: endOfDay } },
        { toDate: { $gte: startOfDay, $lte: endOfDay } },
      ];
    } else {
      query.$or = [
        { reason: { $regex: cleaned, $options: "i" } },
        { status: { $regex: cleaned, $options: "i" } },
      ];
    }
  }

  const sortOrder = sort === "newest" ? -1 : 1;
  const leaveRequests = await Leave.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });
  const total = await Leave.countDocuments(query);
  return {
    leaveRequests,
    page,
    totalPage: Math.ceil(total / limit),
  };
};

// get all leave requests
export const getAllLeaveRequests = async (
  page: number,
  limit: number,
  sort: string,
  status?: string,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const sortOrder = sort === "newest" ? -1 : 1;

  const match: any = {};

  if (status) match.status = status;

  const pipeline: any[] = [
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: "$employee",
    },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "employee.name": { $regex: search, $options: "i" } },
          { "employee.email": { $regex: search, $options: "i" } },
          { "employee.employeeID": { $regex: search, $options: "i" } },
        ],
        ...match,
      },
    });
  } else {
    pipeline.push({ $match: match });
  }
  const totalResult = await Leave.aggregate([...pipeline, { $count: "total" }]);
  const total = totalResult[0]?.total || 0;
  pipeline.push(
    { $sort: { createdAt: sortOrder } },
    { $skip: skip },
    { $limit: limit }
  );
  const leaveRequests = await Leave.aggregate(pipeline);
  const statusCounts = await Leave.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const countByStatus: any = {
    Pending: 0,
    Approved: 0,
    Rejected: 0,
  };

  statusCounts.forEach((s) => {
    countByStatus[s._id] = s.count;
  });

  return {
    leaveRequests,
    page,
    totalPage: Math.ceil(total / limit),
    countByStatus,
  };
};

//get single requests
export const getSingleLeaveRequest = async (requestId: string) => {
  if (!requestId) throw new CustomError("Request Id is required", 400);
  const leaveRequest: any = await Leave.findById(requestId)
    .populate("employeeId", "name email designation department employeeID")
    .lean();
  if (!leaveRequest) throw new CustomError("Leave request not found", 404);
  leaveRequest.employee = leaveRequest.employeeId;
  delete leaveRequest.employeeId;
  return leaveRequest;
};

//update leave request (approve or reject)
export const updateLeaveStatus = async (
  requestId: string,
  data: { status: string; rejectReason: string }
) => {
  const { status, rejectReason } = data;
  if (!requestId) throw new CustomError("Request Id is required", 400);
  if (!status) throw new CustomError("Status is required", 400);

  if (!["Approved", "Rejected"].includes(status)) {
    throw new CustomError("Invalid status value", 400);
  }
  if (status === "Rejected") {
    if (!rejectReason || rejectReason.trim() === "") {
      throw new CustomError("Reject reason is required", 400);
    }
  }
  const leaveRequest: any = await Leave.findByIdAndUpdate(
    requestId,
    { status, rejectReason },
    { new: true }
  )
    .populate("employeeId", "name email designation department employeeID")
    .lean();
  if (!leaveRequest) throw new CustomError("Leave Request Not Found", 404);
  leaveRequest.employee = leaveRequest.employeeId;
  delete leaveRequest.employeeId;
  return leaveRequest;
};
