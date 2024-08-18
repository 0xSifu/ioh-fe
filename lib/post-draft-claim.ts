export const postDraftClaim = async (postdata: any) => {
    const base = process.env.NEXT_PUBLIC_URL_NOVA;
    const details = process.env.NEXT_PUBLIC_POST_CLAIM;
    const url = `${base}${details}`;
  
    const { email, status, transClaimId, _token, benefit } = postdata;
  
    const body = JSON.stringify({
      email,
      status,
      transClaimId,
      benefit
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
  
      const responseData = await response.json();
      
      console.log("Response Data:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error during fetch:", error);
      throw error;
    }
  };
  