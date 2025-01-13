import Layout from "components/layout/Layout"
import Link from "next/link"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { onlyAuthUserSSR } from "services/server-library"

const TermsOfUse = ({ user }) => {
    return (
        <Layout pageTitle="Terms of Use" user={user}>
            {/* Page content */}
            <Container as="section" className="mt-5 py-5">
                <Row className="mt-4 pt-3">
                    <Col>
                        <h2 className="mb-4">Terms of Use</h2>
                        <p>
                            These Terms of Use constitute a legally binding agreement made
                            between you, whether personally or on behalf of an entity
                            (&ldquo;you&rdquo;) and kayloyal(&ldquo;we,&rdquo; &ldquo;us&rdquo;
                            or &ldquo;our&rdquo;), concerning your access to and use of the
                            kayloyal.com website as well as any other media form, API,
                            application or channel related, linked, or otherwise connected
                            thereto (collectively, the &ldquo;Site&rdquo;).
                        </p>
                        <p>
                            You agree that by accessing the Site, you have read, understood,
                            and agree to be bound by all of these Terms of Use. If you do not
                            agree with all of these Terms of Use, then you are expressly
                            prohibited from using the Site and you must discontinue use
                            immediately.
                        </p>
                        <p>
                            Supplemental Terms of Use or documents that may be posted on the
                            Site from time to time are hereby expressly incorporated herein by
                            reference. We reserve the right, in our sole discretion, to make
                            changes or modifications to these Terms of Use at any time and for
                            any reason.
                        </p>
                        <p>
                            We will alert you about any changes by updating the &ldquo;Last
                            updated&rdquo; date of these Terms of Use, and you waive any right
                            to receive specific notice of each such change.
                        </p>
                        <p>
                            It is your responsibility to periodically review these Terms of
                            Use to stay informed of updates. You will be subject to, and will
                            be deemed to have been made aware of and to have accepted, the
                            changes in any revised Terms of Use by your continued use of the
                            Site after the date such revised Terms of Use are posted.
                        </p>
                        <p>
                            The information provided on the Site is not intended for
                            distribution to or use by any person or entity in any jurisdiction
                            or country where such distribution or use would be contrary to law
                            or regulation or which would subject us to any registration
                            requirement within such jurisdiction or country.
                        </p>
                        <p>
                            Accordingly, those persons who choose to access the Site from
                            other locations do so on their own initiative and are solely
                            responsible for compliance with local laws, if and to the extent
                            local laws are applicable.
                        </p>
                        <p>
                            All users who are minors in the jurisdiction in which they reside
                            (generally under the age of 18) must have the permission of, and
                            be directly supervised by, their parent or guardian to use the
                            Site. If you are a minor, you must have your parent or guardian
                            read and agree to these Terms of Use prior to you using the Site.
                        </p>
                        <h4>INTELLECTUAL PROPERTY RIGHTS</h4>
                        <p>
                            Unless otherwise indicated, the Site is our proprietary property
                            and all source code, databases, functionality, software, website
                            designs, audio, video, text, photographs, and graphics on the Site
                            (collectively, the &ldquo;Content&rdquo;) and the trademarks,
                            service marks, and logos contained therein (the
                            &ldquo;Marks&rdquo;) are owned or controlled by us or licensed to
                            us, and are protected by copyright and trademark laws and various
                            other intellectual property rights and unfair competition laws of
                            the United States, foreign jurisdictions, and international
                            conventions.
                        </p>
                        <p>
                            The Content and the Marks are provided on the Site &ldquo;AS
                            IS&rdquo; for your information and personal use only. Except as
                            expressly provided in these Terms of Use, no part of the Site and
                            no Content or Marks may be copied, reproduced, aggregated,
                            republished, uploaded, posted, publicly displayed, encoded,
                            translated, transmitted, distributed, sold, licensed, or otherwise
                            exploited for any commercial purpose whatsoever, without our
                            express prior written permission.
                        </p>
                        <p>
                            Provided that you are eligible to use the Site, you are granted a
                            limited license to access and use the Site and to download or
                            print a copy of any portion of the Content to which you have
                            properly gained access solely for your personal, non-commercial
                            use. We reserve all rights not expressly granted to you in and to
                            the Site, the Content and the Marks.
                        </p>
                        <h4>USER REPRESENTATIONS</h4>
                        <p>By using the Site, you represent and warrant that:</p>
                        <p>
                            (1) all registration information you submit will be true,
                            accurate, current, and complete;
                        </p>
                        <p>
                            (2) you will maintain the accuracy of such information and
                            promptly update such registration information as necessary;
                        </p>
                        <p>
                            (3) you have the legal capacity and you agree to comply with these
                            Terms of Use;
                        </p>
                        <p>
                            (4) you will not use the Site for any illegal or unauthorized
                            purpose;
                        </p>
                        <p>
                            (5) your use of the Site will not violate any applicable law or
                            regulation.
                        </p>
                        <p>
                            If you provide any information that is untrue, inaccurate, not
                            current, or incomplete, we have the right to suspend or terminate
                            your account and refuse any and all current or future use of the
                            Site (or any portion thereof).
                        </p>
                        <h4>USER REGISTRATION</h4>
                        <p>
                            You may be required to register with the Site. You agree to keep
                            your password confidential and will be responsible for all use of
                            your account and password.
                        </p>
                        <p>
                            We reserve the right to terminate or delete your account at any
                            time without notice.
                        </p>
                        <h4>PROHIBITED ACTIVITIES</h4>
                        <p>
                            You may not access or use the Site for any purpose other than that
                            for which we make the Site available. The Site may not be used in
                            connection with illegal activity in any applicable jurisdiction.
                            You must not:
                        </p>
                        <ol>
                            <li>
                                make any unauthorized use of the Site, including collecting
                                usernames and/or email addresses of users by electronic or other
                                means for the purpose of sending unsolicited email, or creating
                                user accounts by automated means or under false pretenses.
                            </li>
                            <li>
                                circumvent, disable, or otherwise interfere with
                                security-related features of the Site.
                            </li>
                            <li>engage in unauthorized framing of or linking to the Site.</li>
                            <li>
                                trick, defraud, or mislead us and other users, especially in any
                                attempt to learn sensitive account information such as user
                                passwords;
                            </li>
                            <li>
                                make improper use of our support services or submit false
                                reports of abuse or misconduct.
                            </li>
                            <li>
                                interfere with, disrupt, or create an undue burden on the Site
                                or the networks or services connected to the Site.
                            </li>
                            <li>
                                attempt to impersonate another user or person or use the
                                username of another user.
                            </li>
                            <li>sell or otherwise transfer your profile.</li>
                            <li>
                                use any information obtained from the Site in order to harass,
                                abuse, or harm another person.
                            </li>
                            <li>
                                cause harm or distress to other websites through the use of our
                                API and proxy services.
                            </li>
                            <li>
                                use the Site as part of any effort to compete with us or
                                otherwise use the Site and/or the Content for any
                                revenue-generating endeavor or commercial enterprise.
                            </li>
                            <li>
                                decipher, decompile, disassemble, or reverse engineer any of the
                                software comprising or in any way making up a part of the Site.
                            </li>
                            <li>
                                attempt to bypass any measures of the Site designed to prevent
                                or restrict access to the Site, or any portion of the Site.
                            </li>
                            <li>
                                harass, annoy, intimidate, or threaten any of our employees or
                                agents engaged in providing any portion of the Site to you.
                            </li>
                            <li>
                                upload or transmit (or attempt to upload or to transmit)
                                viruses, Trojan horses, or other material, including excessive
                                use of capital letters and spamming (continuous posting of
                                repetitive text), that interferes with any party&rsquo;s
                                uninterrupted use and enjoyment of the Site or modifies,
                                impairs, disrupts, alters, or interferes with the use, features,
                                functions, operation, or maintenance of the Site.
                            </li>
                            <li>
                                disparage, tarnish, or otherwise harm, in our opinion, us and/or
                                the Site.
                            </li>
                            <li>
                                use the Site in a manner inconsistent with any applicable laws
                                or regulations.
                            </li>
                        </ol>
                        <h4>REFUNDS</h4>
                        <p>
                            We may issue refunds upon request on a case-by-case basis, at our
                            sole discretion.
                        </p>
                        <h4>LIMITATION OF LIABILITY</h4>
                        <p>
                            In no event shall kayloyal, nor its directors, employees, partners,
                            agents, suppliers, or affiliates, be liable for any indirect,
                            incidental, special, consequential or punitive damages, including
                            without limitation, loss of profits, data, use, goodwill, or other
                            intangible losses, resulting from (i) your access to or use of or
                            inability to access or use the Service; (ii) any conduct or
                            content of any third party on the Service; (iii) any content
                            obtained from the Service; and (iv) unauthorized access, use or
                            alteration of your transmissions or content, whether based on
                            warranty, contract, tort (including negligence) or any other legal
                            theory, whether or not we have been informed of the possibility of
                            such damage, and even if a remedy set forth herein is found to
                            have failed of its essential purpose.
                        </p>
                        <p>
                            We are not obliged to verify the manner in which you or other
                            users use the Website, Platform, Configuration or Services and we
                            shall not be liable for the manner of such usage. We assume that
                            you use the Website Platform and Services legally and ethically
                            and that you have obtained permission, if necessary, to use it on
                            the targeted websites and/or other data sources.
                        </p>
                        <p>
                            We shall not be liable for the outcomes of activities for which
                            you use our Website, Platform, Configuration or Services. Provided
                            that a third-party service or product is established on the
                            Platform or on any of its functionalities, we shall not be liable
                            for such a service or product, their functioning or manner and
                            consequences of their usage.
                        </p>
                        <p>
                            We shall not be liable for any of your unlawful actions in
                            connection to the usage of the Website, Platform, Configuration or
                            Services with respect to third parties (e.g. breach of
                            intellectual property rights, rights to the name or company name,
                            unfair competition, breach of terms of websites or applications
                            and programs of third parties).
                        </p>
                        <p>
                            We shall not guarantee or be liable for the availability of the
                            Website, Platform or Services (or products arising therefrom) or
                            for their performance, reliability or responsiveness or any other
                            performance or time parameters. We shall neither be liable for the
                            functionality or availability of the services of other providers
                            that we mediate to you solely. We shall neither be liable for your
                            breach of service usage terms of such providers.
                        </p>
                        <h4>SITE MANAGEMENT</h4>
                        <p>We reserve the right, but not the obligation, to:</p>
                        <p>(1) monitor the Site for violations of these Terms of Use;</p>
                        <p>
                            (2) take appropriate legal action against anyone who, in our sole
                            discretion, violates the law or these Terms of Use, including
                            without limitation, reporting such user to law enforcement
                            authorities;
                        </p>
                        <p>
                            (3) in our sole discretion and without limitation, refuse,
                            restrict access to, limit the availability of, or disable (to the
                            extent technologically feasible) any of your Contributions or any
                            portion thereof;
                        </p>
                        <p>
                            (4) in our sole discretion and without limitation, notice, or
                            liability, to remove from the Site or otherwise disable all files
                            and content that are excessive in size or are in any way
                            burdensome to our systems;
                        </p>
                        <p>
                            (5) otherwise manage the Site in a manner designed to protect our
                            rights and property and to facilitate the proper functioning of
                            the Site.
                        </p>
                        <h4>PRIVACY POLICY</h4>
                        <p>
                            We care about data privacy and security. Please review our{" "}
                            <a href="/privacy-policy">Privacy Policy</a>. By using the Site,
                            you agree to be bound by our Privacy Policy, which is incorporated
                            into these Terms of Use. Please be advised the Site is hosted in
                            the United States.
                        </p>
                        <p>
                            If you access the Site from the European Union, Asia, or any other
                            region of the world with laws or other requirements governing
                            personal data collection, use, or disclosure that differ from
                            applicable laws in the United States, then through your continued
                            use of the Site, you are transferring your data to the United
                            States, and you expressly consent to have your data transferred to
                            and processed in the United States.
                        </p>
                        <h4>TERM AND TERMINATION</h4>
                        <p>
                            These Terms of Use shall remain in full force and effect while you
                            use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS
                            OF USE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND
                            WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE
                            (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY
                            REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH
                            OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE
                            TERMS OF USE OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY
                            TERMINATE YOUR USE OR PARTICIPATION IN THE SITE OR DELETE [YOUR
                            ACCOUNT AND] ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY
                            TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
                        </p>
                        <p>
                            If we terminate or suspend your account for any reason, you are
                            prohibited from registering and creating a new account under your
                            name, a fake or borrowed name, or the name of any third party,
                            even if you may be acting on behalf of the third party.
                        </p>
                        <p>
                            In addition to terminating or suspending your account, we reserve
                            the right to take appropriate legal action, including without
                            limitation pursuing civil, criminal, and injunctive redress.
                        </p>
                        <h4>MODIFICATIONS AND INTERRUPTIONS</h4>
                        <p>
                            We reserve the right to change, modify, or remove the contents of
                            the Site at any time or for any reason at our sole discretion
                            without notice. However, we have no obligation to update any
                            information on our Site. We also reserve the right to modify or
                            discontinue all or part of the Site without notice at any time.
                        </p>
                        <p>
                            We will not be liable to you or any third party for any
                            modification, price change, suspension, or discontinuance of the
                            Site.
                        </p>
                        <p>
                            We cannot guarantee the Site will be available at all times. We
                            may experience hardware, software, or other problems or need to
                            perform maintenance related to the Site, resulting in
                            interruptions, delays, or errors.
                        </p>
                        <p>
                            We reserve the right to change, revise, update, suspend,
                            discontinue, or otherwise modify the Site at any time or for any
                            reason without notice to you. You agree that we have no liability
                            whatsoever for any loss, damage, or inconvenience caused by your
                            inability to access or use the Site during any downtime or
                            discontinuance of the Site.
                        </p>
                        <p>
                            Nothing in these Terms of Use will be construed to obligate us to
                            maintain and support the Site or to supply any corrections,
                            updates, or releases in connection therewith.
                        </p>
                        <h4>GOVERNING LAW</h4>
                        <p>
                            These Terms of Use and your use of the Site are governed by and
                            construed in accordance with the laws of the State of Wyoming in
                            the United States of America.
                        </p>
                        <h4>DISPUTE RESOLUTION</h4>
                        <p>
                            Any legal action of whatever nature brought by either you or us
                            (collectively, the &ldquo;Parties&rdquo; and individually, a
                            &ldquo;Party&rdquo;) shall be commenced or prosecuted in the state
                            and federal courts located in the State of Wyoming, and the
                            Parties hereby consent to, and waive all defenses of lack of
                            personal jurisdiction and forum non conveniens &nbsp;with respect
                            to venue and jurisdiction in such state and federal courts.
                        </p>
                        <h4>DISCLAIMER</h4>
                        <p>
                            THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE
                            THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE
                            RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
                            WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND
                            YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
                            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                            AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS
                            ABOUT THE ACCURACY OR COMPLETENESS OF THE SITE&rsquo;S CONTENT OR
                            THE CONTENT OF ANY WEBSITES LINKED TO THE SITE AND WE WILL ASSUME
                            NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR
                            INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR
                            PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR
                            ACCESS TO AND USE OF THE SITE, (3) ANY UNAUTHORIZED ACCESS TO OR
                            USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION
                            AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION
                            OR CESSATION OF TRANSMISSION TO OR FROM THE SITE, (5) ANY BUGS,
                            VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR
                            THROUGH THE SITE BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR
                            OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE
                            OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED,
                            TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SITE. WE DO NOT
                            WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY
                            PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH
                            THE SITE, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE
                            APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE
                            WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING
                            ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF
                            PRODUCTS OR SERVICES.
                        </p>
                        <p>
                            AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR
                            IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE
                            CAUTION WHERE APPROPRIATE.
                        </p>
                        <h4>INDEMNIFICATION</h4>
                        <p>
                            You agree to defend, indemnify, and hold us harmless, including
                            our subsidiaries, affiliates, and all of our respective officers,
                            agents, partners, and employees, from and against any loss,
                            damage, liability, claim, or demand, including reasonable
                            attorneys&rsquo; fees and expenses, made by any third party due to
                            or arising out of: (1) your Contributions; (2) use of the Site;
                            (3) breach of these Terms of Use; (4) any breach of your
                            representations and warranties set forth in these Terms of Use;
                            (5) your violation of the rights of a third party, including but
                            not limited to intellectual property rights; or (6) any overt
                            harmful act toward any other user of the Site with whom you
                            connected via the Site.
                        </p>
                        <p>
                            Notwithstanding the foregoing, we reserve the right, at your
                            expense, to assume the exclusive defense and control of any matter
                            for which you are required to indemnify us, and you agree to
                            cooperate, at your expense, with our defense of such claims. We
                            will use reasonable efforts to notify you of any such claim,
                            action, or proceeding which is subject to this indemnification
                            upon becoming aware of it.
                        </p>
                        <h4>USER DATA</h4>
                        <p>
                            We will maintain certain data that you transmit to the Site for
                            the purpose of managing the Site, as well as data relating to your
                            use of the Site. Although we perform regular routine backups of
                            data, you are solely responsible for all data that you transmit or
                            that relates to any activity you have undertaken using the Site.
                        </p>
                        <p>
                            You agree that we shall have no liability to you for any loss or
                            corruption of any such data, and you hereby waive any right of
                            action against us arising from any such loss or corruption of such
                            data.
                        </p>
                        <h4>MISCELLANEOUS</h4>
                        <p>
                            These Terms of Use and any policies or operating rules posted by
                            us on the Site constitute the entire agreement and understanding
                            between you and us. Our failure to exercise or enforce any right
                            or provision of these Terms of use shall not operate as a waiver
                            of such right or provision.
                        </p>
                        <p>
                            These Terms of Use operate to the fullest extent permissible by
                            law. We may assign any or all of our rights and obligations to
                            others at any time. We shall not be responsible or liable for any
                            loss, damage, delay, or failure to act caused by any cause beyond
                            our reasonable control.
                        </p>
                        <p>
                            If any provision or part of a provision of these Terms of Use is
                            determined to be unlawful, void, or unenforceable, that provision
                            or part of the provision is deemed severable from these Terms of
                            Use and does not affect the validity and enforceability of any
                            remaining provisions.
                        </p>
                        <p>
                            There is no joint venture, partnership, employment or agency
                            relationship created between you and us as a result of these Terms
                            of Use or use of the Site. You agree that these Terms of Use will
                            not be construed against us by virtue of having drafted them.
                        </p>
                        <p>
                            You hereby waive any and all defenses you may have based on the
                            electronic form of these Terms of Use and the lack of signing by
                            the parties hereto to execute these Terms of Use.
                        </p>
                        <h4>CONTACT US</h4>
                        <p>
                            In order to resolve a complaint regarding the Site or to receive
                            further information regarding use of the Site, please contact us
                            at: support@kayloyal.com
                        </p>
                    </Col>
                </Row>
            </Container>
        </Layout>
    )
}

export default TermsOfUse

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
