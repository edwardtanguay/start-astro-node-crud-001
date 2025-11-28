import type { Employee, EmployeeFilter } from '../types/employee';

const API_URL = 'http://localhost:3001/api/employees';

export const employeeService = {
  async getAll(filter?: EmployeeFilter): Promise<Employee[]> {
    const params = new URLSearchParams();
    if (filter?.search) params.append('search', filter.search);
    if (filter?.sort) params.append('sort', filter.sort);
    if (filter?.order) params.append('order', filter.order);

    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  },

  async update(id: string, employee: Partial<Employee>): Promise<Employee> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
  },
};
