/**
 * @file packages/utils/src/react.tsx
 * @description React-specific utility components and helpers.
 */

import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import * as React from 'react'
import type { ReactElement, ReactNode } from 'react'

/**
 * Returns an appropriate status icon component based on the given status string.
 *
 * @param status - The status string to evaluate (e.g., 'paid', 'failed').
 * @returns A ReactElement containing the corresponding Lucide icon.
 */
export const getStatusIcon = (status: string | null): ReactElement => {
	switch (status) {
		case 'paid':
			return <CheckCircle2 className="w-6 h-6 text-green-500" />
		case 'failed':
			return <XCircle className="w-6 h-6 text-red-500" />
		default:
			return <Clock className="w-6 h-6 text-yellow-500" />
	}
}