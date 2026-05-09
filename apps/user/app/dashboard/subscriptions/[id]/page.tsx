/**
 * @file app/dashboard/subscriptions/[id]/page.tsx
 * @description Subscription details page — displays detailed information for a specific subscription.
 *
 * Server Component. Fetches subscription details by ID and verifies ownership.
 * Displays subscription information, plan details, and billing period.
 */
import { getAuthUser } from '../../../../lib/auth/server'
import { getSubscriptionById } from '../../../../lib/subscriptions/service'
import { getPlanById } from '../../../../lib/plans/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, CreditCard } from 'lucide-react'
import { formatAmount } from '@workspace/utils'
import { statusColors } from '@workspace/utils/styles'
import CancelSubscriptionButton from '../../../../components/CancelSubscription'

export default async function SubscriptionDetailsPage(props: {
	params: Promise<{ id: string }>
}) {
	const params = await props.params
	const { id } = params

	const { user } = await getAuthUser()
	if (!user) redirect('/login')

	const subscriptionResult = await getSubscriptionById(id)

	if (!subscriptionResult.success || !subscriptionResult.data) {
		return (
			<main className="max-w-4xl mx-auto px-6 py-12">
				<div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-600">
					<p className="font-semibold">Subscription not found</p>
					<Link
						href="/dashboard/subscriptions"
						className="text-sm underline mt-2 inline-block"
					>
						Return to subscriptions
					</Link>
				</div>
			</main>
		)
	}

	const subscription = subscriptionResult.data

	// Security check
	if (subscription.user_id !== user.id) {
		redirect('/dashboard/subscriptions')
	}

	let plan = null
	if (subscription.plan_id) {
		const planResult = await getPlanById(subscription.plan_id)
		if (planResult.success) {
			plan = planResult.data
		}
	}

	// Format dates
	const periodStart = subscription.current_period_start
		? new Date(subscription.current_period_start).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
		: 'N/A'

	const periodEnd = subscription.current_period_end
		? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
		: 'N/A'

	const createdAt = new Date(subscription.created_at).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	const isActive = subscription.status === 'active'

	return (
		<main className="max-w-4xl mx-auto px-6 py-12">
			{/* Back Link */}
			<Link
				href="/dashboard/subscriptions"
				className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
			>
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Subscriptions
			</Link>

			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
						<Calendar className="w-8 h-8 text-blue-600" />
						Subscription Details
					</h1>
					<p className="text-gray-500 mt-1 font-mono text-sm">
						ID: {subscription.id.slice(0, 16)}...
					</p>
				</div>
				<div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
					<span
						className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusColors[subscription.status || 'pending'] || statusColors.pending
							}`}
					>
						{subscription.status || 'pending'}
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Subscription Summary */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
					<h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
						Subscription Information
					</h2>
					<div className="space-y-4">
						{plan && (
							<>
								<div>
									<p className="text-sm text-gray-500">Plan Name</p>
									<p className="text-2xl font-bold text-gray-900">{plan.name}</p>
								</div>

								<div>
									<p className="text-sm text-gray-500">Amount</p>
									<p className="text-xl font-semibold text-gray-900">
										{formatAmount(plan.amount, 'INR')} / {plan.interval}
									</p>
								</div>
							</>
						)}

						{subscription.razorpay_subscription_id && (
							<div>
								<p className="text-sm text-gray-500">Razorpay Subscription ID</p>
								<p className="text-sm font-mono text-gray-800 break-all">
									{subscription.razorpay_subscription_id}
								</p>
							</div>
						)}

						<div>
							<p className="text-sm text-gray-500">Created On</p>
							<p className="text-md text-gray-800">{createdAt}</p>
						</div>

						{subscription.cancel_at_period_end && (
							<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
								<p className="text-sm font-semibold text-orange-800 mb-1">
									⚠️ Cancellation Scheduled
								</p>
								<p className="text-xs text-orange-700">
									This subscription will be cancelled at the end of the current billing period.
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Billing Period */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
					<h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
						<CreditCard className="w-5 h-5 text-gray-400" />
						Billing Period
					</h2>

					<div className="space-y-4">
						<div>
							<p className="text-sm text-gray-500">Period Start</p>
							<p className="text-md text-gray-800">{periodStart}</p>
						</div>

						<div>
							<p className="text-sm text-gray-500">Period End</p>
							<p className="text-md text-gray-800">{periodEnd}</p>
						</div>

						{isActive && !subscription.cancel_at_period_end && (
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-sm text-blue-800">
									<span className="font-semibold">Auto-renewal enabled.</span> Your subscription
									will automatically renew on {periodEnd}.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Plan Features */}
			{plan && plan.features && plan.features.length > 0 && (
				<div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
					<h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
						Plan Features
					</h2>
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{plan.features.map((feature: string, index: number) => (
							<li key={index} className="flex items-start gap-3">
								<span className="text-green-500 mt-1">✓</span>
								<span className="text-gray-700">{feature}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Actions */}
			{isActive && (
				<div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
					<h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
						Manage Subscription
					</h2>
					{subscription.cancel_at_period_end ? (
						<div className="text-center">
							<p className="text-sm text-gray-600 mb-4">
								Your subscription is scheduled to be cancelled on {periodEnd}.
							</p>
							<CancelSubscriptionButton
								currentSubscriptionId={subscription.id}
								btnText="Cancel Now"
							/>
						</div>
					) : (
						<div className="text-center">
							<CancelSubscriptionButton currentSubscriptionId={subscription.id} />
						</div>
					)}
				</div>
			)}

			{/* Quick Links */}
			<div className="mt-8 flex justify-center gap-4">
				<Link href="/dashboard/orders" className="text-blue-600 hover:text-blue-700 font-medium">
					View Orders
				</Link>
				<span className="text-gray-300">|</span>
				<Link
					href="/dashboard/payments"
					className="text-blue-600 hover:text-blue-700 font-medium"
				>
					View Payments
				</Link>
				<span className="text-gray-300">|</span>
				<Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
					Browse Plans
				</Link>
			</div>
		</main>
	)
}
