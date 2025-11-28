import React, { useState, useEffect } from 'react';
import type { Employee } from '../types/employee';

interface EmployeeFormProps {
	initialData?: Employee | null;
	onSubmit: (data: Omit<Employee, 'id'>) => Promise<void>;
	onCancel: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		position: '',
		department: '',
		salary: 0,
		startDate: new Date().toISOString().split('T')[0],
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (initialData) {
			setFormData({
				firstName: initialData.firstName,
				lastName: initialData.lastName,
				email: initialData.email,
				position: initialData.position,
				department: initialData.department,
				salary: initialData.salary,
				startDate: initialData.startDate,
			});
		}
	}, [initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit(formData);
		} finally {
			setLoading(false);
		}
	};

	const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
	const labelClass = "block text-sm font-medium text-gray-700 mb-1";

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className={labelClass}>First Name</label>
					<input
						type="text"
						required
						className={inputClass}
						value={formData.firstName}
						onChange={e => setFormData({ ...formData, firstName: e.target.value })}
					/>
				</div>
				<div>
					<label className={labelClass}>Last Name</label>
					<input
						type="text"
						required
						className={inputClass}
						value={formData.lastName}
						onChange={e => setFormData({ ...formData, lastName: e.target.value })}
					/>
				</div>
			</div>

			<div>
				<label className={labelClass}>Email</label>
				<input
					type="email"
					required
					className={inputClass}
					value={formData.email}
					onChange={e => setFormData({ ...formData, email: e.target.value })}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className={labelClass}>Department</label>
					<input
						type="text"
						required
						className={inputClass}
						value={formData.department}
						onChange={e => setFormData({ ...formData, department: e.target.value })}
					/>
				</div>
				<div>
					<label className={labelClass}>Position</label>
					<input
						type="text"
						required
						className={inputClass}
						value={formData.position}
						onChange={e => setFormData({ ...formData, position: e.target.value })}
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className={labelClass}>Salary</label>
					<input
						type="number"
						required
						min="0"
						className={inputClass}
						value={formData.salary}
						onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
					/>
				</div>
				<div>
					<label className={labelClass}>Start Date</label>
					<input
						type="date"
						required
						className={inputClass}
						value={formData.startDate}
						onChange={e => setFormData({ ...formData, startDate: e.target.value })}
					/>
				</div>
			</div>

			<div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={loading}
					className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? 'Saving...' : 'Save Employee'}
				</button>
			</div>
		</form>
	);
};
