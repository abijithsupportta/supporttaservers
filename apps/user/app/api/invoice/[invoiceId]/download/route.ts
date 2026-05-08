/**
 * @file app/api/invoice/[invoiceId]/download/route.ts
 * @description Generates and streams a PDF invoice for a given invoice ID.
 *
 * Only the authenticated owner of the invoice can download it.
 */

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@workspace/supabase/server'
import { getInvoiceById } from '@/lib/invoices/service'
import { InvoicePDF } from '@/components/InvoicePDF'
import React, { type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ invoiceId: string }> }
) {
	const { invoiceId } = await params

	// Auth check
	const supabase = await createClient()
	const { data: { user }, error: authError } = await supabase.auth.getUser()

	if (authError || !user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	// Fetch invoice — getInvoiceById expects a number
	const result = await getInvoiceById((invoiceId))

	if (!result.success || !result.data) {
		return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
	}

	// Ownership check
	if (result.data.user_id !== user.id) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const invoice = result.data

	// Generate PDF buffer
	const buffer = await renderToBuffer(
		React.createElement(InvoicePDF, { invoice, userEmail: user.email ?? '' }) as ReactElement<DocumentProps>
	)

	// NextResponse requires BodyInit — convert Node Buffer to Uint8Array
	const uint8 = new Uint8Array(buffer)

	const filename = invoice.invoice_number
		? `invoice-${invoice.invoice_number}.pdf`
		: `invoice-${invoice.razorpay_invoice_id}.pdf`

	return new NextResponse(uint8, {
		status: 200,
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${filename}"`,
			'Content-Length': uint8.byteLength.toString(),
		},
	})
}
