'use client';

import { useState } from 'react';
import NavItem from './NavItem';

interface NavItemType {
	href: string;
	active: boolean;
	label: string;
	icon: string;
}

interface MobileNavProps {
	navItems: NavItemType[];
}

export default function MobileNav({ navItems }: MobileNavProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Mobile Menu Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
				aria-label="Toggle menu"
			>
				{isOpen ? (
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				) : (
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				)}
			</button>

			{/* Mobile Sidebar Overlay */}
			{isOpen && (
				<div
					className="md:hidden fixed inset-0 bg-white blur-lg  z-40"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Mobile Sidebar */}
			<aside
				className={`md:hidden fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
			>
				<div className="p-6 text-gray-100 text-xl font-bold tracking-tight border-b border-slate-800 flex items-center gap-2">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">S</div>
					Admin Portal
				</div>
				<nav className="flex-1 p-4 space-y-1" onClick={() => setIsOpen(false)}>
					{navItems.map((item) => (
						<NavItem key={item.href} {...item} />
					))}
				</nav>
			</aside>
		</>
	);
}
