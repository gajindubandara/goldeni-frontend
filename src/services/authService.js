export const handleAuthentication = () => {
    const url = window.location.href;
    const urlObject = new URL(url);
    const hash = urlObject.hash;

    let idToken;

    if (hash) {
        if (new URLSearchParams(hash).get('id_token')) {
            idToken = new URLSearchParams(hash).get('id_token');
        } else {
            idToken = new URLSearchParams(hash).get('#id_token');
        }

        if (idToken) {
            // Create sessions
            localStorage.setItem("idToken", idToken);
            localStorage.setItem("loggedIn", "true");
            const expirationTime = (new Date().getTime() + 3600000).toString(); // 1 hour in milliseconds
            localStorage.setItem("sessionExpiration", expirationTime);

            // Remove all parameters after the hash mark
            const newHash = '';

            // Update the URL with the new hash
            urlObject.hash = newHash;
            window.history.replaceState(null, '', urlObject.toString());

            // Reload the page
            window.location.reload();
        }
    }
};
