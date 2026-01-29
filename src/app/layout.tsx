import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/shared/components/layout/Sidebar'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { AIChatWidget } from '@/features/ai/components/AIChatWidget'

export const metadata: Metadata = {
  title: 'CyberRisk 360 - Gestión de Riesgo Ambiental',
  description: 'Plataforma de Gestión de Riesgo Cibernético para Parques Nacionales Naturales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/30 relative">
          <header className="h-16 border-b flex items-center justify-end px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-20 gap-4">
            {/* Aquí podrían ir más elementos como Breadcrumbs o Perfil */}
            <NotificationBell />
            <div className="w-8 h-8 rounded-full bg-primary/20 border flex items-center justify-center text-xs font-bold text-primary">
              AD
            </div>
          </header>
          <div className="container mx-auto py-8 px-8">
            {children}
          </div>
          <AIChatWidget />
        </main>
      </body>
    </html >
  )
}

