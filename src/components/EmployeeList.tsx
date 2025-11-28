import React, { useState, useEffect } from 'react';
import { Plus, Search, ArrowUpDown, Pencil, Trash2, User } from 'lucide-react';
import { employeeService } from '../services/api';
import type { Employee, EmployeeFilter, SortField, SortOrder } from '../types/employee';
import { Modal } from './Modal';
import { EmployeeForm } from './EmployeeForm';
import { ConfirmModal } from './ConfirmModal';

export const EmployeeList: React.FC = () => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState<EmployeeFilter>({
		search: '',
		sort: 'lastName',
		order: 'asc',
	});

	// Modal states
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const fetchEmployees = async () => {
		setLoading(true);
		try {
			const data = await employeeService.getAll(filter);
			setEmployees(data);
			setError(null);
		} catch (err) {
			setError('Failed to load employees');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const debounce = setTimeout(fetchEmployees, 300);
		return () => clearTimeout(debounce);
	}, [filter]);

	const handleSort = (field: SortField) => {
		setFilter(prev => ({
			...prev,
			sort: field,
			order: prev.sort === field && prev.order === 'asc' ? 'desc' : 'asc',
		}));
	};

	const handleCreate = async (data: Omit<Employee, 'id'>) => {
		try {
			await employeeService.create(data);
			setIsFormOpen(false);
			fetchEmployees();
		} catch (err) {
			console.error(err);
			alert('Failed to create employee');
		}
	};

	const handleUpdate = async (data: Omit<Employee, 'id'>) => {
		if (!editingEmployee) return;
		try {
			await employeeService.update(editingEmployee.id, data);
			setIsFormOpen(false);
			setEditingEmployee(null);
			fetchEmployees();
		} catch (err) {
			console.error(err);
			alert('Failed to update employee');
		}
	};

	const handleDelete = async () => {
		if (!deleteId) return;
		try {
			await employeeService.delete(deleteId);
			setDeleteId(null);
			fetchEmployees();
		} catch (err) {
			console.error(err);
			alert('Failed to delete employee');
		}
	};

	const openCreateModal = () => {
		setEditingEmployee(null);
		setIsFormOpen(true);
	};

	const openEditModal = (employee: Employee) => {
		setEditingEmployee(employee);
		setIsFormOpen(true);
	};

	const SortIcon = ({ field }: { field: SortField }) => {
		if (filter.sort !== field) return <ArrowUpDown size={14} className="text-gray-400 ml-1 inline" />;
		return (
			<ArrowUpDown
				size={14}
				className={`ml-1 inline ${filter.order === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'}`}
			/>
		);
	};

	return (
		<div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Employees</h1>
					<p className="text-gray-500 mt-1">Manage your team members</p>
				</div>
				<button
					onClick={openCreateModal}
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
				>
					<Plus size={20} />
					Add Employee
				</button>
			</div>

			{/* Search and Controls */}
			<div className="mb-6">
				<div className="relative max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
					<input
						type="text"
						placeholder="Search employees..."
						className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
						value={filter.search}
						onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
					/>
				</div>
			</div>

			{/* Loading/Error States */}
			{loading && employees.length === 0 && (
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-500">Loading employees...</p>
				</div>
			)}

			{error && (
				<div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
					{error}
				</div>
			)}

			{/* Desktop Table View */}
			<div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								{['firstName', 'lastName', 'email', 'department', 'position', 'salary', 'startDate'].map((field) => (
									<th
										key={field}
										onClick={() => handleSort(field as SortField)}
										className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none whitespace-nowrap"
									>
										{field.replace(/([A-Z])/g, ' $1').trim()}
										<SortIcon field={field as SortField} />
									</th>
								))}
								<th className="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{employees.map((employee) => (
								<tr key={employee.id} className="hover:bg-gray-50/50 transition-colors group">
									<td className="px-6 py-4 font-medium text-gray-900">{employee.firstName}</td>
									<td className="px-6 py-4 font-medium text-gray-900">{employee.lastName}</td>
									<td className="px-6 py-4 text-gray-600">{employee.email}</td>
									<td className="px-6 py-4">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
											{employee.department}
										</span>
									</td>
									<td className="px-6 py-4 text-gray-600">{employee.position}</td>
									<td className="px-6 py-4 text-gray-600 font-mono">
										${employee.salary.toLocaleString()}
									</td>
									<td className="px-6 py-4 text-gray-600">
										{new Date(employee.startDate).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 text-right">
										<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<button
												onClick={() => openEditModal(employee)}
												className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												title="Edit"
											>
												<Pencil size={18} />
											</button>
											<button
												onClick={() => setDeleteId(employee.id)}
												className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
												title="Delete"
											>
												<Trash2 size={18} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Mobile Card View */}
			<div className="md:hidden space-y-4">
				{employees.map((employee) => (
					<div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
						<div className="flex justify-between items-start">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
									<User size={20} />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">{employee.firstName} {employee.lastName}</h3>
									<p className="text-sm text-gray-500">{employee.position}</p>
								</div>
							</div>
							<div className="flex gap-1">
								<button
									onClick={() => openEditModal(employee)}
									className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"
								>
									<Pencil size={18} />
								</button>
								<button
									onClick={() => setDeleteId(employee.id)}
									className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
								>
									<Trash2 size={18} />
								</button>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-y-2 text-sm">
							<div className="text-gray-500">Department</div>
							<div className="text-gray-900 font-medium text-right">{employee.department}</div>

							<div className="text-gray-500">Email</div>
							<div className="text-gray-900 text-right truncate pl-4">{employee.email}</div>

							<div className="text-gray-500">Salary</div>
							<div className="text-gray-900 font-mono text-right">${employee.salary.toLocaleString()}</div>

							<div className="text-gray-500">Start Date</div>
							<div className="text-gray-900 text-right">{new Date(employee.startDate).toLocaleDateString()}</div>
						</div>
					</div>
				))}
			</div>

			{/* Modals */}
			<Modal
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
			>
				<EmployeeForm
					initialData={editingEmployee}
					onSubmit={editingEmployee ? handleUpdate : handleCreate}
					onCancel={() => setIsFormOpen(false)}
				/>
			</Modal>

			<ConfirmModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleDelete}
				title="Delete Employee"
				message="Are you sure you want to delete this employee? This action cannot be undone."
				confirmText="Delete"
				isDestructive
			/>
		</div>
	);
};
