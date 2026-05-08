import type { Tables, TablesInsert } from '@workspace/database'
import {
	dbGetInvoiceById,
	dbGetInvoiceByRazorpayInvoiceId,
	dbGetInvoicesByUserId,
	dbGetInvoicesByOrderId,
	dbGetInvoiceByRazorpayOrderId,
	dbCreateInvoice,
} from './repository'

/**
 * Invoices Service
 *
 * Business logic for invoice records. Responsibilities:
 * - Wrapping all results in { success, data } | { success, error }
 * - Idempotency check on creation (razorpay_invoice_id)
 *
 * Called by webhook handlers and Server Components.
 */

// ─── Domain types ─────────────────────────────────────────────────────────────

export type Invoice = Tables<'invoices'>

export type ServiceResult<T> =
	| { success: true; data: T }
	| { success: false; error: string }

export type GetInvoiceResult = ServiceResult<Invoice | null>
export type GetInvoicesResult = ServiceResult<Invoice[]>

// ─── Reads ────────────────────────────────────────────────────────────────────

export async function getInvoiceById(id: string): Promise<GetInvoiceResult> {
	const { data, error } = await dbGetInvoiceById(id)
	if (error) return { success: false, error: error.message }
	return { success: true, data }
}

export async function getInvoiceByRazorpayInvoiceId(razorpayInvoiceId: string): Promise<GetInvoiceResult> {
	const { data, error } = await dbGetInvoiceByRazorpayInvoiceId(razorpayInvoiceId)
	if (error) return { success: false, error: error.message }
	return { success: true, data }
}

export async function getInvoicesByUserId(userId: string): Promise<GetInvoicesResult> {
	const { data, error } = await dbGetInvoicesByUserId(userId)
	if (error) return { success: false, error: error.message }
	return { success: true, data: data ?? [] }
}

export async function getInvoicesByOrderId(orderId: string): Promise<GetInvoicesResult> {
	const { data, error } = await dbGetInvoicesByOrderId(orderId)
	if (error) return { success: false, error: error.message }
	return { success: true, data: data ?? [] }
}

export async function getInvoiceByRazorpayOrderId(razorpayOrderId: string): Promise<GetInvoiceResult> {
	const { data, error } = await dbGetInvoiceByRazorpayOrderId(razorpayOrderId)
	if (error) return { success: false, error: error.message }
	return { success: true, data }
}

// ─── Writes ───────────────────────────────────────────────────────────────────

/**
 * createInvoice — inserts a new invoice record.
 *
 * Includes an idempotency check: if an invoice with the same
 * razorpay_invoice_id already exists, returns the existing record
 * instead of inserting a duplicate. This handles Razorpay webhook retries.
 */
export async function createInvoice(input: TablesInsert<'invoices'>): Promise<GetInvoiceResult> {
	// Idempotency check — Razorpay may retry webhooks
	const existing = await dbGetInvoiceByRazorpayInvoiceId(input.razorpay_invoice_id)
	if (existing.data) {
		return { success: true, data: existing.data }
	}

	const { data, error } = await dbCreateInvoice({
		user_id: input.user_id,
		razorpay_invoice_id: input.razorpay_invoice_id,
		razorpay_order_id: input.razorpay_order_id,
		amount_paise: input.amount_paise,
		currency: input.currency ?? 'INR',
		billing_snapshot: input.billing_snapshot ?? {},
		razorpay_payment_id: input.razorpay_payment_id,
		invoice_number: input.invoice_number ?? null,
	})

	if (error) return { success: false, error: error.message }
	return { success: true, data }
}
