export const environment = {
    apiUrl: window.location.hostname.includes('xilo-dev') ? 'https://xilo-dev-api.herokuapp.com/api/' :
        window.location.hostname.includes('xilo-staging') ? 'https://xilo-staging-api.herokuapp.com/api/' : 
        window.location.hostname.includes('localhost') ? 'http://localhost:3000/api/' : 'https://api.xilo.io/api/',
};