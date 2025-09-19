import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { AppLayout } from "@/components/layouts/app-layout"
import { Toaster } from "react-hot-toast"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata = {
  title: "Gov-X India - AI-Powered Civic Engagement",
  description: "Scan, report, and resolve civic issues across India with AI. Building better communities one photo at a time.",
  generator: 'v0.app',
  applicationName: 'Gov-X India',
  referrer: 'origin-when-cross-origin',
  keywords: ['india civic engagement', 'pothole detection', 'municipal corporation', 'AI scanning', 'community issues', 'smart cities india'],
  authors: [{ name: 'Gov-X India Team' }],
  creator: 'Gov-X India',
  publisher: 'Gov-X India',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://gov-x-platform.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Gov-X India - AI-Powered Civic Engagement',
    description: 'Scan, report, and resolve civic issues across India with AI',
    url: 'https://gov-x-platform.vercel.app',
    siteName: 'Gov-X India',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gov-X India - AI-Powered Civic Engagement',
    description: 'Scan, report, and resolve civic issues across India with AI',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Gov-X',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#0d0a14',
    'theme-color': '#a855f7',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0a14' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-32.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Gov-X India" />
        <meta name="application-name" content="Gov-X India" />
        <meta name="msapplication-TileColor" content="#080208" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased dark`}>
        <AuthProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "glass border-border/50",
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
