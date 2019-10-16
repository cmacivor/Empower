// export function getAuthData() {
//     let data = sessionStorage.getItem('authorizationData');

//     let json = JSON.parse(data);

//     return json;
// }


export function getCurrentUrl() {

    let currentHref = window.location.href.substring(  window.location.href.lastIndexOf('/') + 1);

    return currentHref;
}