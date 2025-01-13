import { useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const NotFoundPage = () => {



  return (
    <>
      {/* Custom page title attribute */}
      <Head>
        <title>Finder | 404 Not Found</title>
      </Head>

      {/* Page content */}
      <main className='page-wrapper'>
        <section className='d-flex align-items-center min-vh-100 py-5 bg-secondary'>
          <Container className='d-flex justify-content-center text-center'>
            <Col xs={12} md={10} lg={8} className='px-0'>
              <div className='ratio ratio-16x9 mb-lg-5 mb-4'>

              </div>
              <h1 className='h3 pt-lg-4'>Sorry, the content you are looking for doesn&apos;t exist.</h1>
              <p className='lead mb-5 pb-lg-2'>Either it was removed, or you mistyped the link.</p>
              <Button as={Link} href='/' size='lg' variant='primary rounded-pill w-sm-auto w-100 mb-3'>Go to homepage</Button>
            </Col>
          </Container>
        </section>
      </main>
    </>
  )
}

export default NotFoundPage
