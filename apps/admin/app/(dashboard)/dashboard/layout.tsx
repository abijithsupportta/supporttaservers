/**
 * @file app/(dashboard)/dashboard/layout.tsx
 * @description Dashboard layout — wraps every /dashboard/* route with a
 * persistent sidebar navigation and top header.
 *
 * This is a **Server Component** so it can read request headers to determine
 * the active route and highlight the correct NavItem.
 *
 * Architecture:
 * layout.tsx (Server Component)
 *   ├── Sidebar: NavItem[]  (persistent navigation)
 *   ├── Header: pathname display + Logout button
 *   └── children: page.tsx  (dynamic content)
 */

import Logout from '@workspace/ui/my-components/Logout';
import { headers } from 'next/headers';
import NavItem from '../../../components/NavItem';
import MobileNav from '../../../components/MobileNav';

/**
 * DashboardLayout — persistent shell for all dashboard routes.
 *
 * @param children — the page content rendered by the matched route
 */
export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Read the x-pathname header injected by middleware.ts so we know
	// which route is currently active for sidebar highlighting.
	const headerList = await headers();
	const pathname = headerList.get('x-pathname')?.toLowerCase();

	const navItems = [
		{ href: "/dashboard/", active: pathname?.endsWith("dashboard") || false, label: "Overview", icon: "📊" },
		{ href: "/dashboard/users/", active: pathname?.endsWith("users") || false, label: "Customers", icon: "👥" },
		{ href: "/dashboard/orders/", active: pathname?.endsWith("orders") || false, label: "Orders", icon: "📦" },
		{ href: "/dashboard/payments/", active: pathname?.endsWith("payments") || false, label: "Payments", icon: "💰" },
		{ href: "/dashboard/subscriptions/", active: pathname?.endsWith("subscriptions") || false, label: "Subscriptions", icon: "💳" },
		{ href: "/dashboard/plans", active: pathname?.endsWith("plans") || false, label: "Manage Plans", icon: "📋" },
	];

	return (
		<div className="flex h-screen bg-background">
			{/* Desktop Sidebar */}
			<aside className="w-64 bg-slate-900 hidden md:flex flex-col border-r border-slate-800 fixed min-h-screen z-30">
				<div className="p-6 text-gray-100 text-xl font-bold tracking-tight border-b border-slate-800 flex items-center gap-2">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">S</div>
					Admin Portal
				</div>
				<nav className="flex-1 p-4 space-y-1">
					{navItems.map((item) => (
						<NavItem key={item.href} {...item} />
					))}
				</nav>
			</aside>

			{/* Mobile Navigation */}
			<MobileNav navItems={navItems} />

			<div className="flex-1 flex flex-col ml-16 md:ml-64 w-full">
				<header className="h-16 py-2 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
					<h2 className="text-lg font-medium text-gray-700 capitalize md:ml-0 sm:ml-16 ">Dashboard</h2>
					<Logout />
				</header>

				<main className="flex-1 overflow-auto px-4 py-4 md:px-6 md:py-6">
					{children}
				</main>
			</div>
		</div>
	);
}
