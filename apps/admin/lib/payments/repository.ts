import { createClient } from '@workspace/supabase/server'

/**
 * Payments Repository
 *
 * Raw Supabase access for the `payments` table. No business logic here.
 * Joins with `subscriptions` and `profiles` to get customer and subscription details.
 * Called only by lib/payments/service.ts.
 */

export async function dbGetPayments(opts: { limit?: number; userId?: string } = {}) {
	const supabase = await createClient()

	let query = supabase
		.from('payments')
		.select(`
			*,
			subscription:subscriptions!subscription_id(
				id,
				user_id,
				plan_id,
				razorpay_subscription_id,
				user:profiles!user_id(full_name, email),
				plan:plan!plan_id(name, amount, interval)
			)
		`)
		.order('created_at', { ascending: false })

	if (opts.userId) {
		query = query.eq('subscription.user_id', opts.userId)
	}

	if (opts.limit) {
		query = query.limit(opts.limit)
	}

	return query
}

export async function dbGetPaymentsCount() {
	const supabase = await createClient()
	return supabase.from('payments').select('*', { count: 'exact', head: true })
}

export async function dbGetPaymentsRevenue() {
	const supabase = await createClient()
	return supabase.from('payments').select('amount').eq('status', 'captured')
}
