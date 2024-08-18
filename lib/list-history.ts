export const listHistory = async (token: string, email: string) => {
    if (token === '' || email === '') {
        throw new Error("Both token and email must be provided.");
    }
    // const base = process.env.NEXT_PUBLIC_URL_NOVA;
    const base = process.env.NEXT_PUBLIC_URL_EMAIL;
    const listmember = process.env.NEXT_PUBLIC_EMAIL_LIST;
    const url = `${base}${listmember}`;

    try {
        const data = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!data.ok) {
            throw new Error(`Network response was not ok: ${data.statusText}`);
        }

        const response = await data.json();
        if (response?.lists) {
            const lists = response.lists;
            return lists;
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error;
    }
};