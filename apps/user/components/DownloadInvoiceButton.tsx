/**
 * @file components/DownloadInvoiceButton.tsx
 * @description Client component that triggers a PDF invoice download.
 */

'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DownloadInvoiceButtonProps {
	invoiceId: string
	invoiceNumber?: string | null
}

export function DownloadInvoiceButton({ invoiceId, invoiceNumber }: DownloadInvoiceButtonProps) {
	const [loading, setLoading] = useState(false)

	const handleDownload = async () => {
		setLoading(true)
		try {
			const res = await fetch(`/api/invoice/${invoiceId}/download`)

			if (!res.ok) {
				const err = await res.json().catch(() => ({}))
				toast.error(err.error ?? 'Failed to download invoice')
				return
			}

			// Extract filename from Content-Disposition header if present
			const disposition = res.headers.get('Content-Disposition') ?? ''
			const match = disposition.match(/filename="([^"]+)"/)
			const filename = match?.[1] ?? `invoice-${invoiceNumber ?? invoiceId}.pdf`

			const blob = await res.blob()
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = filename
			a.click()
			URL.revokeObjectURL(url)
		} catch {
			toast.error('Something went wrong. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<button
			onClick={handleDownload}
			disabled={loading}
			title="Download Invoice PDF"
			className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			{loading
				? <Loader2 size={14} className="animate-spin" />
				: <Download size={14} />
			}
			{loading ? 'Downloading…' : 'Invoice'}
		</button>
	)
}
