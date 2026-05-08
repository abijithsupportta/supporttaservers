/**
 * @file app/(dashboard)/dashboard/payments/page.tsx
 * @description Payments list page — server component wrapper that renders
 * the PaymentsTable with all payments (no limit or filter).
 *
 * Architecture:
 * Server Component (this)
 *   ↓ renders
 * PaymentsTable (async Server Component)
 *   ↓ calls
 * Payments Service (lib/payments/service.ts::getPayments)
 *   ↓ calls
 * Payments Repository (lib/payments/repository.ts::dbGetPayments)
 *   ↓ calls
 * Supabase Server Client
 */

import PaymentsTable from './PaymentsTable';

/**
 * PaymentsPage — server component wrapper for the payments list.
 *
 * @returns JSX.Element
 */
export default function PaymentsPage() {
	return (
		<div>
			<h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Payments</h3>
			<PaymentsTable />
		</div>
	);
}
