export const BASE_URL = "http://localhost:5001/api";

export const postRequest = async (url, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    });

    const data = await response.json()
    if (!response.ok) {
        let message;

        if (data?.message) {
            message = data.message;
        } else {
            message = data;
        }

        return { error: true, message };
    }

    return data;
}

export const getRequest = async (url) => {
    const response = await fetch(url);

    const data = response.json();

    if (!response.ok) {
        let message = "Error Occured..";

        if (data?.message) {
            message = data.message;
        }

        return { error: true, message };
    }
    return data;
}

