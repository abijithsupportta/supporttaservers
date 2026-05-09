/**
 * @file app/(dashboard)/dashboard/page.tsx
 * @description Dashboard overview page — the default landing view after login.
 * Displays aggregated stat cards and a recent transactions table.
 *
 * Architecture:
 * Server Component (this)
 *   ↓ calls (parallel)
 * Dashboard Service (lib/dashboard/service.ts::getDashboardStats)
 *   ↓ calls (parallel)
 * User Service   → Order Service   → Revenue Service
 *   ↓              ↓                ↓
 * Repository     Repository       Repository
 *   ↓              ↓                ↓
 * Supabase       Supabase         Supabase
 *
 * Note: Tab navigation is currently commented out in favor of sidebar routes.
 * The tab query param (?tab=users) is preserved for future use.
 */

import OrdersTable from './orders/OrdersTable';
import StatCard from '../../../components/StatCard';
import { getDashboardStats } from '../../../lib/dashboard/service';



export default async function Dashboard({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedSearchParams = await searchParams

	const currentTab = (resolvedSearchParams.tab as string) || 'overview'

	const statsResult = await getDashboardStats()
	const stats = statsResult.success
		? statsResult.data
		: { userCount: 0, orderCount: 0, formattedRevenue: '₹0' }

	return (
		<>
			<h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Overview</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
				<StatCard
					title="Total Customers"
					value={stats.userCount.toLocaleString('en-IN')}
					color="text-blue-600"
					trend="+12%"
				/>
				<StatCard
					title="Total Orders"
					value={stats.orderCount.toLocaleString('en-IN')}
					color="text-slate-900"
					trend="+5%"
				/>
				<StatCard
					title="Gross Revenue"
					value={stats.formattedRevenue}
					color="text-emerald-600"
					trend="+18%"
				/>
			</div>

			{currentTab === 'overview' && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200">
					<div className="p-6 border-b border-gray-100">
						<h3 className="font-semibold text-gray-800">Recent Transactions</h3>
					</div>
					<OrdersTable limit={5} />
				</div>
			)}
		</>
	)
}
