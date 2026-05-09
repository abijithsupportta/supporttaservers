/**
 * @file packages/utils/src/format.ts
 * @description Utility functions for formatting amounts, dates, and times.
 */

/**
 * Formats an amount (in minor units like paise or cents) to a standard currency string.
 *
 * @param amountPaise - The amount to format in minor units.
 * @param currency - The currency code (e.g., 'USD', 'EUR', 'INR'). Defaults to '₹'.
 * @returns Formatted currency string.
 */
export const formatAmount = (amountPaise: number, currency: string | null) => {
	const symbol = currency === 'INR' ? '₹' : currency || '₹'
	return `${symbol}${(amountPaise / 100).toLocaleString()}`
}

/**
 * Formats a date string into a readable short date format (e.g., "Oct 12, 2023").
 *
 * @param dateString - The ISO date string or timestamp to format.
 * @returns Formatted date string, or 'N/A' if the date is null/undefined.
 */
export const formatDate = (dateString: string | null | undefined) => {
	if (!dateString) return 'N/A'
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

/**
 * Formats a date string into a readable short date and time format (e.g., "Oct 12, 2023, 02:30 PM").
 *
 * @param dateString - The ISO date string or timestamp to format.
 * @returns Formatted date and time string, or 'N/A' if the date is null/undefined.
 */
export const formatDateTime = (dateString: string | null | undefined) => {
	if (!dateString) return 'N/A'
	const date = new Date(dateString)
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
