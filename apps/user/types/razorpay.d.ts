/**
 * @file types/razorpay.d.ts
 * @description TypeScript declarations for Razorpay checkout
 */

interface RazorpayOptions {
	key: string
	subscription_id: string
	name: string
	description: string
	callback_url: string
	redirect: boolean
	theme?: {
		color?: string
		backdrop_color?: string
	}
	modal?: {
		ondismiss?: () => void
		escape?: boolean
		animation?: boolean
	}
	prefill?: {
		name?: string
		email?: string
		contact?: string
	}
	notes?: Record<string, string>
	handler?: (response: RazorpaySuccessResponse) => void
}

interface RazorpaySuccessResponse {
	razorpay_payment_id: string
	razorpay_subscription_id: string
	razorpay_signature: string
}

interface RazorpayErrorResponse {
	error: {
		code: string
		description: string
		source: string
		step: string
		reason: string
		metadata: {
			payment_id?: string
			order_id?: string
		}
	}
}

interface RazorpayInstance {
	open(): void
	close(): void
	on(event: 'payment.failed', handler: (response: RazorpayErrorResponse) => void): void
}

interface Window {
	Razorpay: new (options: RazorpayOptions) => RazorpayInstance
}
