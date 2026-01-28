import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/shared/components/layout/Sidebar'

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
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto py-8 px-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}

