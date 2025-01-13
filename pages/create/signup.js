import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Card, Button, Badge } from "react-bootstrap"
import { onlyAuthUserSSR } from "services/server-library"
import { useRouter } from 'next/router'
import SignUp from "components/pass/SignUp"


const FormBuilder = ({ user }) => {
    const router = useRouter()
    const { planId } = router.query // Get planId from URL

    return (
        <Layout pageTitle="Signup" activeNav="Signup" user={user}>
            <AccountLayout accountPageTitle="Signup">
                <SignUp planId={planId} />
            </AccountLayout>
        </Layout>
    )
}
export default FormBuilder

export const getServerSideProps = async (context) => {
    const { req } = context

    const user = await onlyAuthUserSSR(req)
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    } else {

        return {
            props: {
                user: user || null,
            },
        }
    }
}
