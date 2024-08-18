export const FilterListMember = async (email: string, token: string, claimNumber: string, statusClaim: string) => {  
    const base = process.env.NEXT_PUBLIC_URL_NOVA;
    const listmember = process.env.NEXT_PUBLIC_POST_LISTMEMBER;

    if (!base || !listmember) {
        throw new Error("Environment variables NEXT_PUBLIC_URL_NOVA or NEXT_PUBLIC_POST_LISTMEMBER are not defined");
    }

    const url = `${base}${listmember}`;
    const query = `search=${claimNumber}&status=${statusClaim}`;
    const body = JSON.stringify({
        email,
        page: {
            page: 1,
            pageSize: 10,
            q: query
        }
    });

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    console.log("Request URL:", url);
    console.log("Request Body:", body);
    console.log("Request Headers:", headers);

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
        
        // console.log("RESPONSE DATA:", data);
        return data;
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error;
    }
};
