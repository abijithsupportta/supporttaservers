/**
 * @file packages/supabase/src/client.ts
 * @description Client-side Supabase instance creator.
 *
 * Provides a function to create a Supabase client for browser environments,
 * using the anonymous publishable keys.
 */
import { createBrowserClient, } from '@supabase/ssr'

export const createClient = () =>
	createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
	)
