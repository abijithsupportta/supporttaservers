/**
 * @file app/(dashboard)/dashboard/subscriptions/SubscriptionsTable.tsx
 * @description Async server component that fetches and renders all
 * subscription records with plan and subscriber details.
 *
 * Architecture:
 * SubscriptionsTable (Server Component)
 *   ↓ calls
 * Subscriptions Service (lib/subscriptions/service.ts::getAllSubscriptions)
 *   ↓ calls
 * Subscriptions Repository (lib/subscriptions/repository.ts::dbGetSubscriptions)
 *   ↓ calls
 * Supabase Server Client
 *
 * Joins: profiles (full_name, email) + plan (name, amount, interval)
 */

import { formatDate } from '@workspace/utils';
import { getAllSubscriptions } from '../../../../lib/subscriptions/service';

/**
 * SubscriptionsTable — renders a table of all subscription records.
 *
 * @returns JSX.Element
 */
export default async function SubscriptionsTable() {
	const result = await getAllSubscriptions()

	if (!result.success) {
		return (
			<div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-600">
				<p className="font-semibold">Error loading subscriptions</p>
				<p className="text-sm">{result.error}</p>
			</div>
		)
	}

	const subs = result.data

	return (
		<div className="bg-white mt-4 rounded-xl border border-gray-200 overflow-hidden">
			{/* Desktop Table View */}
			<div className="hidden md:block overflow-x-auto">
				<table className="w-full text-left">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscriber</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{subs.map((sub) => (
							<tr key={sub.id} className="hover:bg-gray-50 transition">
								<td className="px-6 py-4">
									<div className="text-sm font-medium text-gray-900">
										{sub.profiles?.full_name ?? '—'}
									</div>
									<div className="text-xs text-gray-500">
										{sub.profiles?.email ?? '—'}
									</div>
								</td>
								<td className="px-6 py-4">
									<span className="text-blue-600 font-medium text-sm">
										{sub.plan?.name ?? '—'}
									</span>
									{sub.plan && (
										<div className="text-xs text-gray-400">
											₹{(sub.plan.amount / 100).toLocaleString('en-IN')} / {sub.plan.interval}
										</div>
									)}
								</td>
								<td className="px-6 py-4 text-sm text-gray-500">
									{sub.current_period_end
										? `Ends ${formatDate(sub.current_period_end)}`
										: '—'}
								</td>
								<td className="px-6 py-4">
									<div className="flex items-center gap-2">
										<div className={`w-2 h-2 rounded-full ${sub.status === 'active' ? 'bg-emerald-500' :
											sub.status === 'cancelled' ? 'bg-red-500' :
												sub.status === 'failed' ? 'bg-orange-500' :
													'bg-gray-400'
											}`} />
										<span className="text-sm text-gray-700 capitalize">{sub.status}</span>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile Card View */}
			<div className="md:hidden divide-y divide-gray-100">
				{subs.map((sub) => (
					<div key={sub.id} className="p-4 hover:bg-gray-50 transition">
						<div className="flex justify-between items-start mb-3">
							<div className="flex-1">
								<div className="text-sm font-medium text-gray-900 mb-1">
									{sub.profiles?.full_name ?? '—'}
								</div>
								<div className="text-xs text-gray-500 mb-2">
									{sub.profiles?.email ?? '—'}
								</div>
								<span className="text-blue-600 font-medium text-sm">
									{sub.plan?.name ?? '—'}
								</span>
								{sub.plan && (
									<div className="text-xs text-gray-400 mt-1">
										₹{(sub.plan.amount / 100).toLocaleString('en-IN')} / {sub.plan.interval}
									</div>
								)}
							</div>
							<div className="flex items-center gap-2">
								<div className={`w-2 h-2 rounded-full ${sub.status === 'active' ? 'bg-emerald-500' :
									sub.status === 'cancelled' ? 'bg-red-500' :
										sub.status === 'failed' ? 'bg-orange-500' :
											'bg-gray-400'
									}`} />
								<span className="text-xs text-gray-700 capitalize">{sub.status}</span>
							</div>
						</div>
						<div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
							{sub.current_period_end
								? `Ends ${formatDate(sub.current_period_end)}`
								: '—'}
						</div>
					</div>
				))}
			</div>

			{subs.length === 0 && (
				<div className="p-12 text-center">
					<p className="text-gray-400 italic">No subscriptions found.</p>
				</div>
			)}
		</div>
	)
}
