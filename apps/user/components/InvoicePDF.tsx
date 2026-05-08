/**
 * @file components/InvoicePDF.tsx
 * @description React PDF template for subscription invoices.
 * Rendered server-side via @react-pdf/renderer.
 */

import {
	Document,
	Font,
	Page,
	Text,
	View,
	StyleSheet,
} from '@react-pdf/renderer'
import type { Tables } from '@workspace/database'
import { formatAmount, formatDate } from '@workspace/utils'
import { appName } from '@workspace/utils/constants'

type Invoice = Tables<'invoices'>

interface InvoicePDFProps {
	invoice: Invoice
	userEmail: string
}

Font.register({
	family: 'Roboto',
	fonts: [
		{
			src: 'https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Me5Q.ttf',
			fontWeight: 'normal',
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmEU9vAw.ttf',
			fontWeight: 'bold',
		},
	],
})

const styles = StyleSheet.create({
	page: {
		fontFamily: 'Roboto',
		fontSize: 10,
		color: '#111827',
		paddingTop: 48,
		paddingBottom: 48,
		paddingHorizontal: 48,
		backgroundColor: '#ffffff',
	},

	// ── Header ──────────────────────────────────────────────────────────────
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 36,
	},
	brandName: {
		fontSize: 22,
		fontFamily: 'Roboto',
		fontWeight: 'bold',
		color: '#1d4ed8',
	},
	invoiceLabel: {
		fontSize: 22,
		fontFamily: 'Roboto',
		fontWeight: 'bold',
		color: '#111827',
		textAlign: 'right',
	},
	invoiceNumber: {
		fontSize: 10,
		color: '#6b7280',
		textAlign: 'right',
		marginTop: 4,
	},

	// ── Divider ─────────────────────────────────────────────────────────────
	divider: {
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
		marginBottom: 24,
	},

	// ── Meta section (Bill To / Invoice Details) ─────────────────────────────
	metaRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 32,
	},
	metaBlock: {
		flex: 1,
	},
	metaLabel: {
		fontSize: 9,
		fontFamily: 'Roboto',
		fontWeight: 'bold',
		color: '#6b7280',
		textTransform: 'uppercase',
		letterSpacing: 0.8,
		marginBottom: 6,
	},
	metaValue: {
		fontSize: 10,
		color: '#111827',
		lineHeight: 1.5,
	},
	metaValueMuted: {
		fontSize: 10,
		color: '#6b7280',
		lineHeight: 1.5,
	},

	// ── Table ────────────────────────────────────────────────────────────────
	table: {
		marginBottom: 24,
	},
	tableHeader: {
		flexDirection: 'row',
		backgroundColor: '#f3f4f6',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 4,
		marginBottom: 2,
	},
	tableRow: {
		flexDirection: 'row',
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
	},
	colDescription: { flex: 3 },
	colQty: { flex: 1, textAlign: 'center' },
	colAmount: { flex: 1, textAlign: 'right' },
	tableHeaderText: {
		fontSize: 9,
		fontFamily: 'Roboto',
		fontWeight: 'bold',
		color: '#6b7280',
		textTransform: 'uppercase',
		letterSpacing: 0.6,
	},
	tableBodyText: {
		fontSize: 10,
		color: '#111827',
	},

	// ── Totals ───────────────────────────────────────────────────────────────
	totalsContainer: {
		alignItems: 'flex-end',
		marginBottom: 36,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		width: 220,
		paddingVertical: 4,
	},
	totalLabel: {
		fontSize: 10,
		color: '#6b7280',
		flex: 1,
		textAlign: 'right',
		paddingRight: 16,
	},
	totalValue: {
		fontSize: 10,
		color: '#111827',
		width: 80,
		textAlign: 'right',
	},
	grandTotalRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		width: 220,
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: '#111827',
		marginTop: 4,
	},
	grandTotalLabel: {
		fontSize: 11,
		fontFamily: 'Roboto',
		fontWeight: 'bold',
		color: '#111827',
		flex: 1,
		textAlign: 'right',
		paddingRight: 16,
	},
	grandTotalValue: {
		fontSize: 11,
		fontFamily: 'Roboto',
		fontWeight: 'bold',
		color: '#1d4ed8',
		width: 80,
		textAlign: 'right',
	},

	// ── Status badge ─────────────────────────────────────────────────────────
	statusBadge: {
		alignSelf: 'flex-start',
		backgroundColor: '#dcfce7',
		borderRadius: 4,
		paddingVertical: 3,
		paddingHorizontal: 8,
		marginBottom: 32,
	},
	statusText: {
		fontSize: 9,
		fontFamily: 'Roboto',
		fontWeight: 'bold',
		color: '#16a34a',
		textTransform: 'uppercase',
		letterSpacing: 0.6,
	},

	// ── Footer ───────────────────────────────────────────────────────────────
	footer: {
		position: 'absolute',
		bottom: 32,
		left: 48,
		right: 48,
		borderTopWidth: 1,
		borderTopColor: '#e5e7eb',
		paddingTop: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	footerText: {
		fontSize: 8,
		color: '#9ca3af',
	},
})



export function InvoicePDF({ invoice, userEmail }: InvoicePDFProps) {
	const currency = invoice.currency ?? 'INR'
	const createdAt = formatDate(invoice.created_at)
	const displayInvoiceNumber = invoice.invoice_number ?? invoice.razorpay_invoice_id

	return (
		<Document
			title={`Invoice ${displayInvoiceNumber}`}
			author={appName}
			subject="Subscription Invoice"
		>
			<Page size="A4" style={styles.page}>

				{/* ── Header ── */}
				<View style={styles.header}>
					<Text style={styles.brandName}>{appName}</Text>
					<View>
						<Text style={styles.invoiceLabel}>INVOICE</Text>
						<Text style={styles.invoiceNumber}>#{displayInvoiceNumber}</Text>
					</View>
				</View>

				<View style={styles.divider} />

				{/* ── Bill To / Invoice Details ── */}
				<View style={styles.metaRow}>
					<View style={styles.metaBlock}>
						<Text style={styles.metaLabel}>Bill To</Text>
						<Text style={styles.metaValue}>{userEmail}</Text>
					</View>
					<View style={[styles.metaBlock, { alignItems: 'flex-end' }]}>
						<Text style={styles.metaLabel}>Invoice Date</Text>
						<Text style={styles.metaValue}>{createdAt}</Text>
						<Text style={[styles.metaLabel, { marginTop: 10 }]}>Payment ID</Text>
						<Text style={styles.metaValueMuted}>{invoice.razorpay_order_id}</Text>
					</View>
				</View>

				{/* ── Status ── */}
				<View style={styles.statusBadge}>
					<Text style={styles.statusText}>Paid</Text>
				</View>

				{/* ── Line items table ── */}
				<View style={styles.table}>
					<View style={styles.tableHeader}>
						<Text style={[styles.tableHeaderText, styles.colDescription]}>Description</Text>
						<Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
						<Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
					</View>
					<View style={styles.tableRow}>
						<Text style={[styles.tableBodyText, styles.colDescription]}>
							Subscription Payment
						</Text>
						<Text style={[styles.tableBodyText, styles.colQty]}>1</Text>
						<Text style={[styles.tableBodyText, styles.colAmount]}>
							{formatAmount(invoice.amount_paise, currency)}
						</Text>
					</View>
				</View>

				{/* ── Totals ── */}
				<View style={styles.totalsContainer}>
					<View style={styles.totalRow}>
						<Text style={styles.totalLabel}>Subtotal</Text>
						<Text style={styles.totalValue}>{formatAmount(invoice.amount_paise, currency)}</Text>
					</View>
					<View style={styles.totalRow}>
						<Text style={styles.totalLabel}>Tax (0%)</Text>
						<Text style={styles.totalValue}>{formatAmount(0, currency)}</Text>
					</View>
					<View style={styles.grandTotalRow}>
						<Text style={styles.grandTotalLabel}>Total</Text>
						<Text style={styles.grandTotalValue}>{formatAmount(invoice.amount_paise, currency)}</Text>
					</View>
				</View>

				{/* ── Footer ── */}
				<View style={styles.footer} fixed>
					<Text style={styles.footerText}>
						{appName} · Thank you for your business
					</Text>
					<Text style={styles.footerText}>
						Invoice #{displayInvoiceNumber}
					</Text>
				</View>

			</Page>
		</Document>
	)
}
