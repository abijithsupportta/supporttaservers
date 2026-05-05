/**
 * @file components/SubscriptionConfirmDialog.tsx
 * @description Confirmation dialog for subscription actions
 */
'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import type { Plan } from '../lib/plans/service'

interface SubscriptionConfirmDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	plan: Plan
	loading: boolean
	onConfirm: () => void
	onCancel: () => void
}

export const SubscriptionConfirmDialog = ({
	open,
	onOpenChange,
	plan,
	loading,
	onConfirm,
	onCancel,
}: SubscriptionConfirmDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold'>Confirm Subscription</DialogTitle>
					<DialogDescription>
						You are about to subscribe to the <strong>{plan.name}</strong> plan for{' '}
						<strong>₹{Math.floor(plan.amount / 100)}/{plan.interval}</strong>.
						You will be redirected to Razorpay to complete the payment.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={onCancel}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						className='bg-blue-500'
						onClick={onConfirm}
						disabled={loading}
					>
						{loading ? 'Redirecting...' : 'Confirm'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
