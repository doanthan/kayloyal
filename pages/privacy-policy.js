import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import Link from "next/link"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { onlyAuthUserSSR } from "services/server-library"

const PrivacyPolicy = ({ user }) => {
    return (
        <Layout pageTitle="Privacy Policy" user={user}>
            {/* Page content */}
            <Container as="section" className="mt-5 py-5">
                <Row className="mt-4 pt-3">
                    <Col>
                        <h2 className="mb-4">Privacy Policy</h2>
                        <p>
                            This Privacy Policy sets out the commitment of kayloyal
                            (kayloyal.com) ("kayloyal", "we", "us") to protect the privacy of
                            personal information we collect about you, including through this
                            website, https://kayloyal.com ("Website"), as well as through our
                            other business operations or directly from you.
                        </p>

                        <p>
                            Please read this Privacy Policy carefully and contact us using the
                            details set out below if you have any questions.
                        </p>

                        <p>
                            By providing us with personal information, you indicate that you
                            have had sufficient opportunity to access this Privacy Policy and
                            that you have read and accepted it and consent to the collection,
                            use, holding and disclosure of your personal information as
                            outlined.
                        </p>

                        <p>
                            If you don't want to provide personal information to us, then you
                            don't have to, however this may affect your use of this website.
                        </p>

                        <h4>1. TYPES OF PERSONAL INFORMATION WE COLLECT</h4>

                        <p>The types of personal information we collect may include:</p>

                        <ul>
                            <li>
                                identity data (including your name and username or similar
                                identifier);
                            </li>
                            <li>
                                contact data (including your contact details such as your
                                billing address and email address);
                            </li>
                            <li>
                                transaction data (including details about payments to and from
                                you and other details of products/services you have purchased
                                from us);
                            </li>
                            <li>
                                technical data (including your internet protocol (IP) address,
                                your login data, browser type and version, time zone setting and
                                location, operating system and platform, and other technology on
                                the devices you use to access our website);
                            </li>
                            <li>
                                profile data (including your username and password, purchases or
                                orders made by you, your preferences, feedback and survey
                                responses);
                            </li>
                            <li>
                                usage data (including information about how you use our website,
                                products and services); and
                            </li>
                            <li>
                                marketing and communications data (including your preferences in
                                receiving marketing from us and our third parties and your
                                communication preferences).
                            </li>
                        </ul>

                        <h4>2. HOW WE COLLECT PERSONAL INFORMATION</h4>

                        <p>We collect personal information about you from:</p>

                        <ul>
                            <li>
                                You directly (including when you provide data to us when
                                registering for an account, subscribing to our service, posting
                                material or requesting further services);
                            </li>
                            <li>Your use of our Website;</li>
                            <li>
                                Third parties (including our business partners, advertising
                                networks, analytics providers, and search information
                                providers).
                            </li>
                        </ul>

                        <h4>
                            3. WHY WE COLLECT, HOLD, USE AND DISCLOSE PERSONAL INFORMATION
                        </h4>

                        <p>
                            We collect, hold, use and disclose your personal information as is
                            reasonably necessary for us to perform our core functions and
                            activities, including for the following purposes:
                        </p>

                        <ul>
                            <li>to contact and communicate with you;</li>
                            <li>to provide goods and/or services to you;</li>
                            <li>
                                to maintain a database of customers, subscribers or similar;
                            </li>
                            <li>
                                to market to you and others, including remarketing (this may
                                include sending you emails and displaying advertisements on the
                                Internet);
                            </li>
                            <li>to help us improve our services;</li>
                            <li>
                                to comply with our legal obligations and resolve any disputes
                                that we may have;
                            </li>
                            <li>to comply with our reporting obligations;</li>
                            <li>for security purposes; and</li>
                            <li>
                                for any other purpose communicated to you at the time we collect
                                your personal information or as required or permitted by law.
                            </li>
                        </ul>

                        <h4>4. DISCLOSURE OF PERSONAL INFORMATION TO THIRD PARTIES</h4>

                        <p>We may disclose personal information to:</p>

                        <ul>
                            <li>our employees, contractors and/or related entities;</li>
                            <li>
                                our existing or potential agents and/or business partners;
                            </li>
                            <li>
                                third party service providers for the purpose of enabling them
                                to provide their services including (without limitation) IT
                                service providers, data storage, web-hosting and server
                                providers, marketing or advertising providers, debt collectors,
                                couriers and payment systems operators;
                            </li>
                            <li>
                                our sponsors or promoters of any competition that we conduct;
                            </li>
                            <li>
                                any applicable or relevant regulator or third party for the
                                purpose of legislative or contractual compliance and/or
                                reporting; or
                            </li>
                            <li>
                                any other third parties as required or permitted by law, such as
                                where we receive a subpoena.
                            </li>
                        </ul>

                        <h4>5. OVERSEAS DISCLOSURE</h4>

                        <p>
                            We may disclose personal information to third party service
                            providers or contractors located overseas for some of the purposes
                            listed above. We take reasonable steps to ensure that the overseas
                            recipients of your personal information do not breach the privacy
                            obligations relating to your personal information.
                        </p>

                        <h4>6. YOUR RIGHTS AND CONTROLLING YOUR PERSONAL INFORMATION</h4>

                        <p>
                            Your choice: Please read this Privacy Policy carefully. If you
                            provide personal information to us, you understand we will
                            collect, hold, use and disclose your personal information in
                            accordance with this Privacy Policy. You do not have to provide
                            personal information to us, however, if you do not, it may affect
                            your use of our website or the products and/or services offered on
                            or through it.
                        </p>

                        <p>
                            Information from third parties: If we receive personal information
                            about you from a third party, we will protect it as set out in
                            this Privacy Policy. If you are a third party providing personal
                            information about somebody else, you represent and warrant that
                            you have such person's consent to provide the personal information
                            to us.
                        </p>

                        <p>
                            Restrict and unsubscribe: To object to processing for direct
                            marketing/unsubscribe from our email database or opt-out of
                            communications (including marketing communications), please
                            contact us using the details below or opt-out using the opt-out
                            facilities provided in the communication.
                        </p>

                        <p>
                            Access: You may request access to the personal information that we
                            hold about you. An administrative fee may be payable for the
                            provision of such information. Please note, in some situations, we
                            may be legally permitted to withhold access to your personal
                            information.
                        </p>

                        <p>
                            Correction: If you believe that any information we hold about you
                            is inaccurate, out of date, incomplete, irrelevant or misleading,
                            please contact us using the details below. We will take reasonable
                            steps to promptly correct any information found to be inaccurate,
                            out of date, incomplete, irrelevant or misleading.
                        </p>

                        <p>
                            Complaints: If you wish to make a complaint, please contact us
                            using the details below and provide us with full details of the
                            complaint. We will promptly investigate your complaint and respond
                            to you, in writing, setting out the outcome of our investigation
                            and the steps we will take in response to your complaint.
                        </p>

                        <h4>7. STORAGE AND SECURITY</h4>

                        <p>
                            We are committed to ensuring that the personal information we
                            collect is secure. In order to prevent unauthorised access or
                            disclosure, we have put in place suitable physical, electronic and
                            managerial procedures, to safeguard and secure personal
                            information and protect it from misuse, interference, loss and
                            unauthorised access, modification and disclosure.
                        </p>

                        <p>
                            While we are committed to security, we cannot guarantee the
                            security of any information that is transmitted to or by us over
                            the Internet. The transmission and exchange of information is
                            carried out at your own risk.
                        </p>

                        <h4>8. COOKIES & WEB BEACONS</h4>

                        <p>
                            We may use cookies on our website from time to time. Cookies are
                            text files placed in your computer's browser to store your
                            preferences. Cookies, by themselves, do not tell us your email
                            address or other personally identifiable information. However,
                            they do recognise you when you return to our website and allow
                            third parties to cause our advertisements to appear on your social
                            media and online media feeds as part of our retargeting campaigns.
                            If and when you choose to provide our website with personal
                            information, this information may be linked to the data stored in
                            the cookie.
                        </p>

                        <p>
                            You can block cookies by activating the setting on your browser
                            that allows you to refuse the setting of all or some cookies.
                            However, if you use your browser settings to block all cookies
                            (including essential cookies) you may not be able to access all or
                            parts of our website.
                        </p>

                        <p>
                            We may use web beacons on our website from time to time. Web
                            beacons (also known as Clear GIFs) are small pieces of code placed
                            on a web page to monitor the behaviour and collect data about the
                            visitors viewing a web page. For example, web beacons can be used
                            to count the users who visit a web page or to deliver a cookie to
                            the browser of a visitor viewing that page.
                        </p>

                        <h4>9. LINKS TO OTHER WEBSITES</h4>

                        <p>
                            Our website may contain links to other websites. We do not have
                            any control over those websites and we are not responsible for the
                            protection and privacy of any personal information which you
                            provide whilst visiting those websites. Those websites are not
                            governed by this Privacy Policy.
                        </p>

                        <h4>10. AMENDMENTS</h4>

                        <p>
                            We may, at any time and at our discretion, vary this Privacy
                            Policy by publishing the amended Privacy Policy on our website. We
                            recommend you check our website regularly to ensure you are aware
                            of our current Privacy Policy.
                        </p>

                        <p>
                            For any questions or notice, please contact us using these
                            details: info@kayloyal.com
                        </p>
                    </Col>
                </Row>
            </Container>
        </Layout>
    )
}

export default PrivacyPolicy

//All public pages should use this
export const getServerSideProps = async (context) => {
    const { req } = context

    const user = await onlyAuthUserSSR(req)
    return {
        props: {
            user: user || null, // Ensure user is null if not authenticated
        },
    }
}
