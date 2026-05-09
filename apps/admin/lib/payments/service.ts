import { dbGetPayments, dbGetPaymentsCount, dbGetPaymentsRevenue } from './repository'
import type { Tables } from '@workspace/database'

/**
 * Payments Service
 *
 * Business logic for payments. Responsibilities:
 * - Converting paise → ₹ for display (amount / 100)
 * - Aggregating total revenue across all captured payments
 * - Formatting revenue as a localised ₹ string (en-IN)
 *
 * Payments are read-only from the admin — no mutation actions exist here.
 */

// ─── Domain types ─────────────────────────────────────────────────────────────

/** A payment row joined with subscription and profile details */
export type PaymentWithDetails = Tables<'payments'> & {
	subscription: {
		id: string
		user_id: string
		plan_id: string
		razorpay_subscription_id: string | null
		user: Pick<Tables<'profiles'>, 'full_name' | 'email'> | null
		plan: Pick<Tables<'plan'>, 'name' | 'amount' | 'interval'> | null
	} | null
}

/** Return type of getPayments */
export type GetPaymentsResult =
	| { success: true; data: PaymentWithDetails[] }
	| { success: false; error: string }

export async function getPayments(opts: { limit?: number; userId?: string } = {}): Promise<GetPaymentsResult> {
	const { data, error } = await dbGetPayments(opts)
	if (error) return { success: false as const, error: error.message }
	return { success: true as const, data: data ?? [] }
}

export async function getPaymentsCount() {
	const { count, error } = await dbGetPaymentsCount()
	if (error) return { success: false as const, error: error.message }
	return { success: true as const, count: count ?? 0 }
}

export async function getTotalRevenuePaise() {
	const { data, error } = await dbGetPaymentsRevenue()
	if (error) return { success: false as const, error: error.message }
	const total = data?.reduce((acc, row) => acc + (row.amount ?? 0), 0) ?? 0
	return { success: true as const, totalPaise: total }
}

/** Returns revenue formatted as ₹ string */
export async function getFormattedRevenue() {
	const result = await getTotalRevenuePaise()
	if (!result.success) return { success: false as const, error: result.error }
	const formatted = `₹${(result.totalPaise / 100).toLocaleString('en-IN')}`
	return { success: true as const, formatted }
}
