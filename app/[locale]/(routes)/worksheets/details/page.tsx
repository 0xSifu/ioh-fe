import React from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {detailClaim} from "@/lib/detail-claim";
import Container from "@/app/[locale]/(routes)/components/ui/Container";
import SuspenseLoading from "@/components/loadings/suspense";
import DataTableDetail from "./table-components/data-table-detail";

interface Props {
    searchParams: {
        cardNumber: string;
        claimNo: string;
        currency: string;
        rateValue: string;
    };
}

const DetailPage = async ({searchParams}: Props) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return null;
    }

    const {cardNumber, claimNo, currency, rateValue} = searchParams;

    const email = session.user.email;
    const token = session.user.accessToken;

    const detail = await detailClaim(email, token || '', cardNumber, claimNo);

    return (
        <Container
            title="Detail Claim"
            description={"Everything you need to know about detail claim"}
        >
            <React.Suspense fallback={<SuspenseLoading/>}>

                <DataTableDetail
                    email={email}
                    token={token || ''}
                    data={detail.data}
                    currency={currency}
                    rateValue={parseFloat(rateValue)}
                />
                
            </React.Suspense>
        </Container>
    );
};

export default DetailPage;
