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

    console.log(adminType);

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

    static getAll() {

        let sessionStorageData = getSessionData();

        console.log(sessionStorageData);

        return  fetch(sessionStorageData.GetAllApiUrl, {
            //mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json());
    }

    static async saveNew(postData) {

        let sessionStorageData = getSessionData();

        try {

            //create the new record
           return fetch(sessionStorageData.CreateApiUrl, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                },
                body: JSON.stringify(postData)
            });

        } catch (error) {
            console.log(error);
            alert('an error occurred while saving the data.');
        }
    }
}
