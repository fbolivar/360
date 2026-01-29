import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // HARD BYPASS: Si no existen las credenciales, asumimos modo local
    // y retornamos la respuesta sin procesar Supabase.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // En modo local, no bloqueamos rutas
        return response;
    }

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet: any) {
                        cookiesToSet.forEach(({ name, value, options }: any) => request.cookies.set(name, value))
                        response = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }: any) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const {
            data: { user },
        } = await supabase.auth.getUser()

        // Proteger rutas administrativas
        if (request.nextUrl.pathname.startsWith('/settings') && !user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        if (request.nextUrl.pathname.startsWith('/audit') && !user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    } catch (e) {
        // Fallo silencioso si Supabase no responde
        console.warn("Supabase middleware bypassed due to error:", e);
    }

    return response
}
