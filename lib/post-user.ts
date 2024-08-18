export const postUserData = async (email: string, token: string) => {  
  const base = process.env.NEXT_URL_BASE;
  const findbyemail = process.env.NEXT_POST_GETFINDBYEMAIL;
  const url = `${base}${findbyemail}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    // console.log("RESPONSE DATA:", data);
    // console.log('TOKEN : ',token);
    
    return data;
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
};
