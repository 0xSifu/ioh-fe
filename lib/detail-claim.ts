export const detailClaim = async (email: string, _token: string, cardNumber: string, claimNumber: string) => {
    const base = process.env.NEXT_URL_NOVA;
    const details = process.env.NEXT_POST_CLAIM_DETAIL;
    const url = `${base}${details}`;
    
    const body = JSON.stringify({
        email,
        cardNumber,
        claimNumber
    });

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${_token}`
    };


    try {
        const response = await fetch(url, {
            method: "POST",
            body: body,
            headers: headers,
        });
  
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        
        // console.log("Response Data:", data);
        return data;
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error;
    }
};
