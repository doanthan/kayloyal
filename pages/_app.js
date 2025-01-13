import Router from "next/router"
import Head from "next/head"
import NProgress from "nprogress"
import ScrollTopButton from "../components/library/ScrollTopButton"
import "../scss/theme.scss"
import { AuthProvider } from "services/AuthProvider"
import 'react-datasheet-grid/dist/style.css'
import { Toaster } from 'react-hot-toast'


const Finder = ({ Component, pageProps }) => {
  // Bind NProgress to Next Router events (Page loading animation)
  Router.events.on("routeChangeStart", () => NProgress.start())
  Router.events.on("routeChangeComplete", () => NProgress.done())
  Router.events.on("routeChangeError", () => NProgress.done())

  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kayloyal</title>
        <meta name="description" content="KayPush - Web Push made easy" />
        <meta
          name="keywords"
          content="react, nextjs, bootstrap, business, directory, listings, e-commerce, car dealer, city guide, real estate, job board, user account, multipurpose, ui kit, css3, javascript, gallery, slider, touch"
        />
        <meta name="author" content="Createx Studio" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon.ico"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon.ico"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" color="#5bbad5" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#766df4" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            maxWidth: '500px',
            fontSize: '14px'
          },
          success: {
            duration: 3000,
            style: {
              background: '#28a745',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#dc3545',
            },
          },
        }}
      />

      <Component {...pageProps} />

      <ScrollTopButton
        showOffset={600}
        duration={800}
        easing="easeInOutQuart"
        tooltip="Top"
      />
    </AuthProvider>
  )
}

export default Finder
