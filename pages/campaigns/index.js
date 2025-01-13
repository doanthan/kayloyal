import { useEffect, useState } from "react"
import KpushLayout from "components/kpush/layout/KpushLayout"
import KpushAccountLayout from "components/kpush/layout/KpushAccountLayout"
import { Button, Row } from "react-bootstrap"
import "react-datepicker/dist/react-datepicker.css"
import Link from "next/link"
import { onlyAuthUserSSR } from "services/server-library"
import AccountSetup from "components/kpush/AccountSetup"
import PastCampaignsTable from "components/khub/campaigns/PastCampaignsTable"
import Campaign from "models/campaign"
import connect from "services/db"
import { decompressData } from 'services/library'


const KpushCampaigns = ({ user, campaigns }) => {
  const [displayCampaigns, setDisplayCampaigns] = useState(campaigns);

  const handleCampaignDelete = (deletedCampaignId) => {
    setDisplayCampaigns(prevCampaigns => prevCampaigns.filter(campaign => campaign._id !== deletedCampaignId));
  };


  return (
    <KpushLayout pageTitle="Campaigns" activeNav="Dashboard" user={user}>
      <KpushAccountLayout accountPageTitle="Campaigns">

        <Row>
          <div className="campaigns-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0">Campaigns</h2>
              <Link href="campaigns/new" passHref>
                <Button variant="primary">Create new campaign</Button>
              </Link>
            </div>
          </div>
        </Row>
        <PastCampaignsTable campaigns={displayCampaigns} handleCampaignDelete={handleCampaignDelete} />

      </KpushAccountLayout>
    </KpushLayout>
  )
}

export default KpushCampaigns

//All private pages should use this
export const getServerSideProps = async (context) => {
  const { req, params } = context

  const user = await onlyAuthUserSSR(req, true)
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  } else {
    await connect()
    const campaignResults = await Campaign.find({ userId: user._id })
    if (!campaignResults) {
      return {
        notFound: true,
      };
    }

    // Convert the campaign to a JSON object
    const campaigns = JSON.parse(JSON.stringify(campaignResults));
    const cleanedData = campaigns.map(({
      userId,
      mergeTemplate,
      inclusionAccountTags,
      exclusionAccountTags,
      inclusionAccounts,
      exclusionAccounts,
      customTemplates,
      mergeTags,
      subjectData,
      createdAt,
      sendToAccounts,
      ...rest
    }) => ({
      ...rest,
      sendToAccountsCount: sendToAccounts ? sendToAccounts.length : 0
    }));
    console.log(cleanedData)
    return {
      props: {
        user: user || null, // Ensure user is null if not authenticated
        campaigns: cleanedData,
      }
    }
  }
}