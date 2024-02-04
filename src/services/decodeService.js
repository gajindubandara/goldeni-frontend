// services/authService.js
export const decodeIdToken = () => {
    const idToken = localStorage.getItem("idToken");

    if (idToken) {
        try {
            console.log(idToken);
            // Decoding the payload (second part of the token)
            const decodedPayload = JSON.parse(atob(idToken.split('.')[1]));

            const email = decodedPayload.email; // Replace 'email' with the attribute you want to access
            const name = decodedPayload.name; // Replace 'name' with the attribute you want to access
            const picture = decodedPayload.picture;
            const customRole = decodedPayload['custom:role'];

            // Check if custom role is "admin"
            const isAdmin = customRole === "admin";

            console.log(decodedPayload);

            return { email, name, picture,isAdmin };
        } catch (error) {
            console.error('Error decoding ID token:', error);
            return null;
        }
    } else {
        console.error('ID token not found in local storage');
        return null;
    }
};
