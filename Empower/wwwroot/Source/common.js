export function getAuthData() {
    let data = sessionStorage.getItem('authorizationData');

    let json = JSON.parse(data);

    return json;
}