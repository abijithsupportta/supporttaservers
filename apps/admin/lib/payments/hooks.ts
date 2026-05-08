'use client'

import { useQuery } from '@tanstack/react-query'
import type { PaymentWithDetails } from './service'

/**
 * React Query hooks for payments data.
 * Used by client components that need to fetch payments.
 */

export function usePayments(opts: { limit?: number; userId?: string } = {}) {
	return useQuery<PaymentWithDetails[]>({
		queryKey: ['payments', opts],
		queryFn: async () => {
			const params = new URLSearchParams()
			if (opts.limit) params.set('limit', String(opts.limit))
			if (opts.userId) params.set('userId', opts.userId)
			const res = await fetch(`/api/payments?${params}`)
			if (!res.ok) throw new Error('Failed to fetch payments')
			return res.json()
		},
	})
}
