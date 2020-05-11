import React, { useState, useEffect } from 'react';
import {addActive, closeAllLists, removeActive, populateSearchBox, onKeyDownHandler } from './AutoComplete';
import { getSessionData } from './commonAdmin';
import $ from 'jquery';


const AddressJuvenile = (props) => {

    let personID = '';
    let addressID = '';
    let addressLineOne = '';
    let addressLineTwo = '';
    let addressZip = '';
    let councilDistrict = '';
    let addressTypeId = 0;
    let city = '';
    let state = '';
    let comments = '';
    let isHomeless = '';
    let propertyTypeId = '';
    let propertyTypeDescription = 'Please Select';


    let gisCode = '';
    let latitude = '';
    let longitude = '';
    
    let createdDate = '';
    let createdBy = '';

    let propertyTypes = props.propertyTypeValues;

    if (props.clientProfile !== undefined) {
        
        personID = props.clientProfile.Person.ID;

        if (props.clientProfile.PersonAddress.length > 0) {
            console.log(props.clientProfile.PersonAddress);
    
            let personInfo = props.clientProfile.PersonAddress[0];
            addressID = personInfo.ID;

            addressLineOne = (personInfo.AddressLineOne !== null) ? personInfo.AddressLineOne : '';
            addressLineTwo = (personInfo.AddressLineTwo !== null) ? personInfo.AddressLineTwo: '';
            addressZip = (personInfo.Zip !== null) ? personInfo.Zip : '';
            addressTypeId = (personInfo.AddressTypeID !== null) ? personInfo.AddressTypeID : 0;
            councilDistrict = (personInfo.CouncilDistrict !== null) ? personInfo.CouncilDistrict : '';
            city = (personInfo.City !== null) ? personInfo.City : '';
            state = (personInfo.State !== null) ? personInfo.State : '';
            comments =(personInfo.Comments !== null) ? personInfo.Comments : '';

            propertyTypeId = (personInfo.PropertyTypeID !== null ) ? personInfo.PropertyTypeID : '';
            propertyTypeDescription = (personInfo.PropertyType !== null) ? personInfo.PropertyType.Name : ' Please Select';
            isHomeless = (personInfo.Homeless !== null) ? personInfo.Homeless : '';

            gisCode = (personInfo.GISCode !== null ) ? personInfo.GISCode : '';
            latitude = (personInfo.Latitude !== null ) ? personInfo.Latitude : '';
            longitude = (personInfo.Longitude !== null) ? personInfo.Longitude : '';
            createdDate = (personInfo.CreatedDate !== null) ? personInfo.CreatedDate : '';
            createdBy = (personInfo.CreatedBy !== null) ? personInfo.CreatedBy : '';
        }
    }

    const [bingAddresses, setBingAddresses] = useState([]);
    const [isRefreshed, setIsRefreshed] = useState(0);
    const [propertyTypesValues, setPropertyTypes] = useState(propertyTypes);

    useEffect(() => {

        let sessionData = getSessionData();
        let roleId = sessionData.RoleID;

        $("#txtDJSAddressLineOne").val(addressLineOne);
        $("#txtDJSAddressLineTwo").val(addressLineTwo);
        $("#txtDJSZip").val(addressZip);
        $("#txtDJSComments").val(comments);
        $("#txtDJSCouncilDistrict").val(councilDistrict);


        //it's a DJS-City address
        if (addressTypeId === 1) {
            $("#txtDJSCity").val('Richmond');
            $("#txtDJSState").val('VA');
        }
        else { // it's a DJS non-city address
            $("#txtDJSCity").val(city);
            $("#txtDJSState").val(state);
        }

        document.getElementById("btnDDLRRHAProperty").value = propertyTypeId ;
        document.getElementById("btnDDLRRHAProperty").innerHTML = propertyTypeDescription;

        setRadioButtonState("rdpIsHomelessYes", "rdpIsHomelessNo", isHomeless);
        
        $("#hdnAdddressTypeID").val(addressTypeId);
        $("#hdnAddressCreatedDate").val(createdDate);
        $("#hdnAddressCreatedBy").val(createdBy);
        $("#hdnGISCode").val(gisCode);
        $("hdnLatitude").val(latitude);
        $("#hdnLongitude").val(longitude);
        $("#hdnAddressID").val(addressID);
        $("#hdnPersonID").val(personID);


        setPropertyTypes(propertyTypes);
    });

    function setRadioButtonState(rdYes, rdNo, clientValue) {
        if (clientValue === null || clientValue === '') {
            document.getElementById(rdNo).checked = true;
            return;
        }

        if (clientValue) {
            document.getElementById(rdYes).checked = true;
        } else {
            document.getElementById(rdNo).checked = true;
        }
    }

    function getRadioButtonState(rdYes) {
        let yesChecked = document.getElementById(rdYes).checked;
        if (yesChecked) {
            return true;
        }
        return false;
    }


    function toggle() {
        $('#BingSearchModal').modal('toggle');
    }


    function searchBing(txtAddressSearch) {
        let tableRef = document.getElementById("bingTable").getElementsByTagName('tbody')[0];

        let address = document.getElementById(txtAddressSearch).value; 
        
        if (address === "") {
            return;
        }

        let baseUrl = "https://dev.virtualearth.net/REST/v1/Locations?countryRegion=US&addressLine=" + address;

          //Using the jQuery way because the Fetch API doesn't support JSONP
          $.ajax({
            url: baseUrl,
            dataType: "jsonp",
            jsonp: "jsonp",
            data: {
                key: "AioE2WYI4PFEB6QJ05ws3SYzEfBmT4Dq4GcO-ACemmZnFi5pyKjXeE44i9Qz0QOS",
            },
            success: function(response) {
                //console.log(response);
                var resources = response.resourceSets[0].resources;
                
                document.getElementById("bingTableBody").innerHTML = "";

                resources.forEach(addressItem => {
                    let newRow = tableRef.insertRow();

                    let iconCell = newRow.insertCell(0);
                    let icon = document.createElement("i");
                    icon.classList.add("fas");
                    icon.classList.add("fa-arrow-down");
         
                    let addressCell = newRow.insertCell(1);
                    addressCell.innerText = addressItem.name;
                    addressCell.style = "cursor:pointer";
                         
                });
            },
            error: function(e) {
                console.log(e.statusText);
            }
        });
           
        toggle();
    }

    function searchDJSBingClickHandler() {
        searchBing("txtDJSAddressSearch");
    }

    function djsSearchOnChangeEventHandler(event) {
        onChangeEventHandler(event, 1, "txtDJSAddressSearch");
    }


    function onChangeEventHandler(event, addressTypeId, searchBoxId) {
        
        let input = event.target.value;
        
        let url = "https://starappdev2.richva.ci.richmond.va.us/services/geodataapi/api/searchaddress?street=";

        if (input.length < 5){
            return;    
        }

        let completeUrl = url + input;

        fetch(completeUrl, {
            method: 'get',
            //mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(result => {
            return result.json();
        }).then(result => {

            populateSearchBox(result, 1, searchBoxId);

            //set the AddressTypeID
            $("#hdnAdddressTypeID").val(1);

        });
    }

   
    document.addEventListener("click", function (e) {
        closeAllLists(e.target, "txtDJSAddressSearch");

        closeAllLists(e.target, "txtCSUAddressSearch");
    });

    function onKeyDownEventHandler(e) {
        onKeyDownHandler(e, "txtDJSAddressSearch");

    }


    function updateAddress() {

        let sessionStorageData = getSessionData();

        let hdnAddressTypeID = $("#hdnAdddressTypeID").val();

        let postData = {
            AddressTypeID: hdnAddressTypeID,
            GISCode: $("#hdnGISCode").val(),
            Latitude: $("#hdnLatitude").val(),
            Longitude: $("#hdnLongitude").val(),
            City: 'RICHMOND', 
            State: 'VA', 
            Active: true,
            Homeless : getRadioButtonState("rdpIsHomelessYes"),
            PropertyTypeID: document.getElementById("btnDDLRRHAProperty").value  
        };

        let addressId = $("#hdnAddressID").val();
        let methodType = '';

        if (addressId !== "") { //it's an existing record
            methodType = 'PUT';

            postData.ID = addressID;
            postData.PersonID = $("#hdnPersonID").val();
            
            postData.UpdatedDate = new Date();
            postData.UpdatedBy = sessionStorageData.CurrentUser;
            postData.CreatedDate = $("#hdnAddressCreatedDate").val();
            postData.CreatedBy = $("#hdnAddressCreatedBy").val();

        } else { //it's a new record
            methodType = 'POST';

            postData.PersonID = $("#hdnPersonID").val();

            postData.UpdatedDate = new Date();
            postData.UpdatedBy = sessionStorageData.CurrentUser;
            postData.CreatedDate = new Date();
            postData.CreatedBy = sessionStorageData.CurrentUser;
        }

        postData.AddressLineOne = $("#txtDJSAddressLineOne").val();
        postData.AddressLineTwo = $("#txtDJSAddressLineTwo").val();
        postData.Zip = $("#txtDJSZip").val();
        postData.CouncilDistrict = $("#txtDJSCouncilDistrict").val();
        postData.Comments = $("#txtDJSComments").val();

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        

        let personAddress = `${apiAddress}/api/PersonAddress`;


        fetch(personAddress, {
            method: methodType,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(postData)
        })
        .then(result => result.json())
        .then(result => {

            if (result === null || result.Message !== undefined) {
                props.createErrorNotification("An error occurred while saving the adddress.");
                return;
            }

            if (result !== 0) {
                props.createNotification("The address was successfully updated.");
            }
        });

    }

    function handlePropertyTypeChange(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        document.getElementById("btnDDLRRHAProperty").value = selectedValue;

        let selectedPropertType =  propertyTypes.filter(function(propertyType) {
            return propertyType.ID === parseInt(selectedValue);
        });

        document.getElementById("btnDDLRRHAProperty").innerHTML = selectedPropertType[0].Description;
    }


    let propertyTypeValueOptions = [];
    if (propertyTypesValues.length > 0 ) {
        propertyTypeValueOptions = propertyTypesValues.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Description} onClick={ handlePropertyTypeChange } className="dropdown-item">{value.Description}</a>
         );
    }
    


    return <div>
        <br></br>
        <input type="hidden" id="hdnAddressID" value="" />
        <input type="hidden" id="hdnAdddressTypeID" value="" />
        <input type="hidden" id="hdnAddressCreatedDate" value=""/>
        <input type="hidden" id="hdnAddressCreatedBy" value="" />
        <input type="hidden" id="hdnPersonID" value="" />
        <input type="hidden" id="hdnGISCode" value="" />
        <input type="hidden" id="hdnLatitude" value="" />
        <input type="hidden" id="hdnLongitude" value="" />
        <input type="hidden" id="hdnPropertyTypeId" value="" />
        <div className="form-row">
            <div className="col-6">
                <h5>DJS Address</h5>
                <div className="input-group mb-3">
                    <input type="text" placeholder="Start typing DJU Address"  onKeyDown={onKeyDownEventHandler} onChange={djsSearchOnChangeEventHandler} id="txtDJSAddressSearch" className="form-control" defaultValue="" />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" onClick={searchDJSBingClickHandler} type="button">Search Bing</button>
                    </div>
                </div>
            </div>
        </div>
        <br></br>
        <div className="form-row">
            <div className="col-6">
                <label id="lblDJSAddressType"></label>
                <input type="text" placeholder="Address Line 1" id="txtDJSAddressLineOne" className="form-control" defaultValue=""/>
            </div>
        </div>
        <br></br>
        <div className="form-row">
            <div className="col-6">
                <input type="text" placeholder="Address Line 2" id="txtDJSAddressLineTwo" className="form-control" defaultValue=""/>
            </div>
        </div>
        <br></br>
        <div className="form-row">
            <div className="form-group col-md-3">
                <input type="text" placeholder="City" className="form-control" id="txtDJSCity" defaultValue="Richmond"/>
            </div>
            <div className="form-group col-md-1">
                <input type="text" placeholder="State" id="txtDJSState" className="form-control" defaultValue="VA"/>
            </div>
            <div className="form-group col-md-1">
                <input type="text" className="form-control" placeholder="Zip" id="txtDJSZip" defaultValue=""/>
            </div>
        </div>
        <div className="form-row">
            <div className="form-group col-md-3">
                <input type="text" className="form-control" placeholder="Comments" id="txtDJSComments" defaultValue="" />
            </div>          
        </div>
        <div className="form-row">
            <div className="form-group col-md-3">
                <input type="text" className="form-control" id="txtDJSCouncilDistrict" placeholder="Council District" defaultValue="" />
            </div>
        </div>
        <div className="form-row">
            <div className="col-3">
                <label><strong>Homeless </strong></label>
                <div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="rdpIsHomeless" id="rdpIsHomelessYes"  />
                        <label className="form-check-label">Yes</label>         
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="rdpIsHomeless" id="rdpIsHomelessNo"  />
                        <label className="form-check-label">No</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="form-row">
        <div className="col-4">
            <label htmlFor="ddlRRHAProperty"><strong>RRHA Property</strong></label>
                <div className="dropdown">
                    <button type="button" id="btnDDLRRHAProperty" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        
                    </button>
                    <div className="dropdown-menu">
                        { propertyTypeValueOptions  }
                    </div>
                </div>
            </div>
        </div>
        <div className="form-row">
            <div className="col-8">          
            </div>
            <div className="col-auto">
                <button id="btnUpdateAddress" className="btn btn-primary" onClick={updateAddress} >Update</button>
            </div>
            <div className="col-auto">
                <button type="button" onClick={() => setIsRefreshed(isRefreshed + 1)}  className="btn btn-primary mb-2">Reset</button>
            </div>
        </div>
        <div className="modal fade" id="BingSearchModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Matching Adddresses</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <table id="bingTable" className="table">
                        <thead>
                            <tr>
                                <th scope="col">Address</th>
                            </tr>
                        </thead>
                        <tbody id="bingTableBody">

                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary"  >Save New</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    </div>
}

export default AddressJuvenile;