/**
 * @file packages/supabase/src/server.ts
 * @description Server-side Supabase instance creator.
 *
 * Provides a function to create a Supabase client for server environments
 * (e.g., Server Components, Server Actions, Route Handlers) utilizing Next.js cookies.
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
	const cookieStore = await cookies()

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						)
					} catch {

					}
				},
			},
		}
	)
}