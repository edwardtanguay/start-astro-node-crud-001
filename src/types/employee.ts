export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
}

export type SortField = keyof Employee;
export type SortOrder = 'asc' | 'desc';

export interface EmployeeFilter {
  search?: string;
  sort?: SortField;
  order?: SortOrder;
}
