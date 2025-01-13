import Head from "next/head"
import Header from "./Header"
import Footer from "./Footer"


const KpushLayout = (props) => {

    return (
        <>
            <Head>
                <title>{`kayloyal - ${props.pageTitle}`}</title>
            </Head>


            <Header activeNav={props.activeNav} user={props.user} />

            {/* Page wrapper for sticky footer
      
      Wraps everything except footer to push footer to the bottom of the page if there is little content */}
            <main className="page-wrapper">
                {/* Navbar (main site header with branding and navigation) */}

                {/* Page content */}
                {props.children}
            </main>

            {/* Footer */}
            <Footer />
        </>
    )
}

export default KpushLayout
