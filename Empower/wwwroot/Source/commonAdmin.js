export function getCurrentUrl() {

    let currentHref = window.location.href.substring(  window.location.href.lastIndexOf('/') + 1);

    return currentHref;
}

export function getSessionData() {

    let apiAddress = sessionStorage.getItem("baseApiAddress");

    let token = sessionStorage.getItem("token");

    let currentUser = sessionStorage.getItem("userName");

    let systemID = sessionStorage.getItem("systemID");

    let adminType = getCurrentUrl();

    let fullCreateAddress = `${apiAddress}/api/${adminType}/Create`;

    let fullUpdateAddress = `${apiAddress}/api/${adminType}/Update`;

    let sessionData = {
        Token: token,
        CurrentUser: currentUser,
        AdminType : getCurrentUrl(),
        SystemID: systemID,
        CreateApiUrl: fullCreateAddress,
        UpdateApiUrl: fullUpdateAddress     
    }

    return sessionData;
}