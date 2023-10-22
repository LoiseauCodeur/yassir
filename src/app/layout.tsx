import './globals.css'
import Header from './components/header/Header'; 
import Footer from './components/footer/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className='z-0 bg-sky-100'>
        <Header>
        </Header>
        {children}
        <Footer />
      </body>
    </html>
  )
}
