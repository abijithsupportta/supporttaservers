/**
 * @file app/(dashboard)/dashboard/payments/PaymentsTable.tsx
 * @description Async server component that fetches payment records and
 * renders them in a styled table with customer, amount, status, and date.
 *
 * Architecture:
 * PaymentsTable (Server Component)
 *   ↓ calls
 * Payments Service (lib/payments/service.ts::getPayments)
 *   ↓ calls
 * Payments Repository (lib/payments/repository.ts::dbGetPayments)
 *   ↓ calls
 * Supabase Server Client
 *
 * Joins: subscriptions → profiles (full_name, email) + plan (name, amount, interval)
 * Amount is displayed in ₹ (converted from paise ÷100).
 */

import { formatDate } from '@workspace/utils';
import { getPayments } from '../../../../lib/payments/service';

/** Props for the PaymentsTable component */
interface PaymentsTableProps {
	/** Maximum number of rows to fetch (optional) */
	limit?: number;
	/** Filter to a specific user's payments (optional) */
	userId?: string;
}

/**
 * PaymentsTable — renders a table of payment records.
 *
 * @param limit — max rows to show
 * @param userId — optional user filter for profile pages
 */
export default async function PaymentsTable({ limit, userId }: PaymentsTableProps) {
	// ─── Fetch data through the service layer ────────────────────
	const result = await getPayments({ limit, userId });

	if (!result.success) {
		return (
			<div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-600">
				<p className="font-semibold">Error loading payments</p>
				<p className="text-sm">{result.error}</p>
			</div>
		)
	}

	const payments = result.data

	return (
		<div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
			{/* Desktop Table View */}
			<div className="hidden md:block overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-gray-50 border-b border-gray-200">
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{payments.map((payment) => (
							<tr key={payment.id} className="hover:bg-gray-50 transition-colors">
								<td className="px-6 py-4 text-sm font-mono text-gray-600">
									#{payment.id.slice(0, 8)}
								</td>
								<td className="px-6 py-4">
									<div className="text-sm font-medium text-gray-900">
										{payment.subscription?.user?.full_name ?? '—'}
									</div>
									<div className="text-xs text-gray-500">
										{payment.subscription?.user?.email ?? '—'}
									</div>
								</td>
								<td className="px-6 py-4">
									<div className="text-sm font-medium text-blue-600">
										{payment.subscription?.plan?.name ?? '—'}
									</div>
									{payment.subscription?.plan && (
										<div className="text-xs text-gray-400">
											₹{(payment.subscription.plan.amount / 100).toLocaleString('en-IN')} / {payment.subscription.plan.interval}
										</div>
									)}
								</td>
								<td className="px-6 py-4 text-sm font-semibold text-gray-900">
									₹{(payment.amount / 100).toLocaleString('en-IN')}
								</td>
								<td className="px-6 py-4">
									<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === 'captured'
										? 'bg-emerald-50 text-emerald-700'
										: payment.status === 'failed'
											? 'bg-red-50 text-red-700'
											: payment.status === 'authorized'
												? 'bg-blue-50 text-blue-700'
												: 'bg-amber-50 text-amber-700'
										}`}>
										{payment.status}
									</span>
								</td>
								<td className="px-6 py-4 text-sm text-gray-500">

									{payment.paid_at ? formatDate(payment.paid_at) : '—'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile Card View */}
			<div className="md:hidden divide-y divide-gray-100">
				{payments.map((payment) => (
					<div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
						<div className="flex justify-between items-start mb-2">
							<div className="flex-1">
								<div className="text-xs font-mono text-gray-500 mb-1">
									#{payment.id.slice(0, 8)}
								</div>
								<div className="text-sm font-medium text-gray-900">
									{payment.subscription?.user?.full_name ?? '—'}
								</div>
								<div className="text-xs text-gray-500 mb-2">
									{payment.subscription?.user?.email ?? '—'}
								</div>
								<div className="text-sm font-medium text-blue-600">
									{payment.subscription?.plan?.name ?? '—'}
								</div>
								{payment.subscription?.plan && (
									<div className="text-xs text-gray-400">
										₹{(payment.subscription.plan.amount / 100).toLocaleString('en-IN')} / {payment.subscription.plan.interval}
									</div>
								)}
							</div>
							<span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${payment.status === 'captured'
								? 'bg-emerald-50 text-emerald-700'
								: payment.status === 'failed'
									? 'bg-red-50 text-red-700'
									: payment.status === 'authorized'
										? 'bg-blue-50 text-blue-700'
										: 'bg-amber-50 text-amber-700'
								}`}>
								{payment.status}
							</span>
						</div>
						<div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
							<div className="text-sm font-semibold text-gray-900">
								₹{(payment.amount / 100).toLocaleString('en-IN')}
							</div>
							<div className="text-xs text-gray-500">
								{payment.paid_at ? formatDate(payment.paid_at) : '—'}
							</div>
						</div>
					</div>
				))}
			</div>

			{payments.length === 0 && (
				<div className="p-12 text-center">
					<p className="text-gray-400 italic">No payments found.</p>
				</div>
			)}
		</div>
	)
}
