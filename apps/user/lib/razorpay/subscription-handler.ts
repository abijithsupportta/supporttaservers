/**
 * @file lib/razorpay/subscription-handler.ts
 * @description Utility functions for handling Razorpay subscription checkout
 */

import { toast } from 'sonner'
import { appName } from '@workspace/utils/constants'

/**
 * Loads the Razorpay checkout script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
	return new Promise((resolve) => {
		// Check if script is already loaded
		if ((window as any).Razorpay) {
			resolve(true)
			return
		}

		const script = document.createElement('script')
		script.src = 'https://checkout.razorpay.com/v1/checkout.js'
		script.onload = () => resolve(true)
		script.onerror = () => resolve(false)
		document.body.appendChild(script)
	})
}

export interface RazorpaySubscriptionOptions {
	subscriptionId: string
	planName: string
	interval: string
	onSuccess?: () => void
	onFailure?: (error: any) => void
}

/**
 * Opens Razorpay checkout for subscription payment
 */
export const openRazorpayCheckout = async (options: RazorpaySubscriptionOptions) => {
	const { subscriptionId, planName, interval, onSuccess, onFailure } = options

	// Load Razorpay script
	const scriptLoaded = await loadRazorpayScript()
	if (!scriptLoaded) {
		toast.error('Failed to load payment gateway. Please try again.')
		onFailure?.(new Error('Script loading failed'))
		return false
	}

	// Verify Razorpay key is configured
	const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
	if (!razorpayKey) {
		toast.error('Payment gateway is not configured properly.')
		onFailure?.(new Error('Razorpay key not configured'))
		return false
	}

	try {
		// Create Razorpay options
		const razorpayOptions = {
			key: razorpayKey,
			subscription_id: subscriptionId,
			name: appName,
			description: `${interval} Subscription - ${planName}`,
			callback_url: `${window.location.origin}/api/subscription/callback`,
			redirect: true,
			theme: {
				color: '#3B82F6', // Blue-600
			},
			modal: {
				ondismiss: () => {
					toast.info('Payment cancelled. You can try again anytime.')
					onFailure?.(new Error('Payment dismissed by user'))
				},
			},
		}

		// Initialize and open Razorpay checkout
		const rzp = new (window as any).Razorpay(razorpayOptions)

		rzp.on('payment.failed', (response: any) => {
			console.error('Payment failed:', response.error)
			toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`)
			onFailure?.(response.error)
		})

		rzp.open()
		onSuccess?.()
		return true
	} catch (error) {
		console.error('Razorpay checkout error:', error)
		toast.error('Failed to open payment gateway. Please try again.')
		onFailure?.(error)
		return false
	}
}

/**
 * Validates Razorpay configuration
 */
export const validateRazorpayConfig = (): boolean => {
	if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
		console.error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured')
		return false
	}
	return true
}
