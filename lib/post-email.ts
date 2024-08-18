export const postEmail = async (token: string, email: string, payload: any) => {
  const base = process.env.NEXT_PUBLIC_URL_EMAIL;
  const details = process.env.NEXT_PUBLIC_POST_EMAIL;
  const url = `${base}${details}`;
    
  // Directly use the payload as the body
  const body = JSON.stringify(payload);

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  console.log("DATA TEMP : ", body);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      body: body,  // Use the updated body here
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
