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

    let fullDeleteAddress = `${apiAddress}/api/${adminType}/Delete`;

    let fullGetAllAdress = `${apiAddress}/api/${adminType}/GetAll`;

    let sessionData = {
        Token: token,
        CurrentUser: currentUser,
        AdminType : getCurrentUrl(),
        SystemID: systemID,
        CreateApiUrl: fullCreateAddress,
        UpdateApiUrl: fullUpdateAddress,
        DeleteApiUrl: fullDeleteAddress,
        GetAllApiUrl: fullGetAllAdress     
    }

    return sessionData;
}


export class Api {
    static async getAll() {

        let sessionStorageData = getSessionData();

        return  fetch(sessionStorageData.GetAllApiUrl, {
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json());
    }
}

// export  function loadNewGrid( ) {
//     let sessionStorageData = getSessionData();


    // fetch(sessionStorageData.GetAllApiUrl, {
    //     mode: 'cors',
    //     headers: {
    //         'Authorization': 'Bearer ' + sessionStorageData.Token
    //     }
    // }).then(result => result.json())
    //     .then(rowData => this.setState({ rowData }));
//}