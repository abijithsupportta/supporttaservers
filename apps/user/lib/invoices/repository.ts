import { supabaseAdmin } from '@workspace/supabase/admin'
import type { TablesInsert } from '@workspace/database'

/**
 * Invoices Repository
 *
 * Raw Supabase access for the `invoices` table.
 * Uses supabaseAdmin (service role) because invoices are written
 * from webhook handlers which have no user session.
 *
 * Called only by lib/invoices/service.ts.
 */

// ─── Reads ────────────────────────────────────────────────────────────────────

export async function dbGetInvoiceById(id: string) {
	return supabaseAdmin
		.from('invoices')
		.select('*')
		.eq('id', id)
		.single()
}

export async function dbGetInvoiceByRazorpayInvoiceId(razorpayInvoiceId: string) {
	return supabaseAdmin
		.from('invoices')
		.select('*')
		.eq('razorpay_invoice_id', razorpayInvoiceId)
		.single()
}

export async function dbGetInvoicesByUserId(userId: string) {
	return supabaseAdmin
		.from('invoices')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
}

export async function dbGetInvoicesByOrderId(orderId: string) {
	return supabaseAdmin
		.from('invoices')
		.select('*')
		.eq('order_id', orderId)
		.order('created_at', { ascending: false })
}

export async function dbGetInvoiceByRazorpayOrderId(razorpayOrderId: string) {
	return supabaseAdmin
		.from('invoices')
		.select('*')
		.eq('razorpay_order_id', razorpayOrderId)
		.single()
}

// ─── Writes ───────────────────────────────────────────────────────────────────

export async function dbCreateInvoice(data: TablesInsert<'invoices'>) {
	return supabaseAdmin
		.from('invoices')
		.insert([data])
		.select()
		.single()
}
