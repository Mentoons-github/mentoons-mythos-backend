export interface EmployeeFilterOptions {
  search?: string;
  designation?: string | string[];
  jobType?: string | string[];
  department?: string | string[];
  status?: string;
  experience?: number | { $gte?: number; $lte?: number };
}

export interface EmployeeTaskFilterOptions {
  status?: string[];
  priority?: string | string[];
  designation?: string | string[];
  department?: string | string[];
}
