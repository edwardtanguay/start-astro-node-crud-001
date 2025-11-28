import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	isDestructive = false,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<div className="flex flex-col items-center text-center p-4">
				{isDestructive && (
					<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
						<AlertTriangle size={24} />
					</div>
				)}
				<p className="text-gray-600 mb-6">{message}</p>
				<div className="flex gap-3 w-full">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						{cancelText}
					</button>
					<button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${isDestructive
								? 'bg-red-600 hover:bg-red-700'
								: 'bg-blue-600 hover:bg-blue-700'
							}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</Modal>
	);
};
