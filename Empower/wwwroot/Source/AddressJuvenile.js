import React, { useState, useEffect } from 'react';
import {addActive, closeAllLists, removeActive, populateSearchBox, onKeyDownHandler, populateCSUFields, populateDJSFields } from './AutoComplete';
import { getSessionData } from './commonAdmin';
import {FaTrash, FaExchangeAlt, FaArrowDown} from 'react-icons/fa';
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

    let gisCode = '';
    let latitude = '';
    let longitude = '';
    
    let createdDate = '';
    let createdBy = '';


    if (props.clientProfile !== undefined) {
        
        personID = props.clientProfile.Person.ID;

        if (props.clientProfile.PersonAddress.length > 0) {
    
            let personInfo = props.clientProfile.PersonAddress[0];
            addressID = personInfo.ID;

            addressLineOne = (personInfo.AddressLineOne !== null) ? personInfo.AddressLineOne : '';
            addressLineTwo = (personInfo.AddressLineTwo !== null) ? personInfo.AddressLineTwo: '';
            addressZip = (personInfo.Zip !== null) ? personInfo.Zip : '';
            addressTypeId = (personInfo.AddressTypeID !== null) ? personInfo.AddressTypeID : 0;
            councilDistrict = (personInfo.CouncilDistrict !== null) ? personInfo.CouncilDistrict : '';
            city = (personInfo.City !== null) ? personInfo.City : '';
            state = (personInfo.State !== null) ? personInfo.State : '';
            gisCode = (personInfo.GISCode !== null ) ? personInfo.GISCode : '';
            latitude = (personInfo.Latitude !== null ) ? personInfo.Latitude : '';
            longitude = (personInfo.Longitude !== null) ? personInfo.Longitude : '';
            createdDate = (personInfo.CreatedDate !== null) ? personInfo.CreatedDate : '';
            createdBy = (personInfo.CreatedBy !== null) ? personInfo.CreatedBy : '';
        }
    }

    const [bingAddresses, setBingAddresses] = useState([]);
    const [isRefreshed, setIsRefreshed] = useState(0);

    useEffect(() => {

        let sessionData = getSessionData();
        let roleId = sessionData.RoleID;

        //enable or disable the fields by role type
        if (roleId === "1" || roleId === "2" || roleId === "3") {
            $("#txtCSUAddressSearch").prop('disabled', true);
            $("#txtCSUAddressLineOne").prop('disabled', true);
            $("#txtCSUAddressLineTwo").prop('disabled', true);
            $("#txtCSUZip").prop('disabled', true);
            $("#txtCSUCouncilDistrict").prop('disabled', true);
            $("#txtCSUCity").prop('disabled', true);
            $("#txtCSUState").prop('disabled', true);
        } 

        //disable the DJS fields if they're a CSU user
        if (roleId === "4") {
            $("#txtDJSAddressSearch").prop('disabled', true);
            $("#txtDJSAddressLineOne").prop('disabled', true);
            $("#txtDJSAddressLineTwo").prop('disabled', true);
            $("#txtDJSZip").prop('disabled', true);
            $("#txtDJSCouncilDistrict").prop('disabled', true);
            $("#txtDJSCity").prop('disabled', true);
            $("#txtDJSState").prop('disabled', true);
        }



        //superuser, admin, djs
          if (addressTypeId === 1 || addressTypeId === 2) {

            $("#txtDJSAddressLineOne").val(addressLineOne);
            $("#txtDJSAddressLineTwo").val(addressLineTwo);
            $("#txtDJSZip").val(addressZip);
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
        }

        //CSU
        if (addressTypeId === 3 || addressTypeId === 4) {
            $("#txtCSUAddressLineOne").val(addressLineOne);
            $("#txtCSUAddressLineTwo").val(addressLineTwo);
            $("#txtCSUZip").val(addressZip);
            $("#txtCSUCouncilDistrict").val(councilDistrict);

            if (addressTypeId === 3) {
                $("#txtCSUCity").val("Richmond");
                $("#txtCSUState").val('VA');
            }
            else {
                $("#txtCSUCity").val(city);
                $("#txtCSUState").val(state);
            }
        }

        $("#hdnAddressCreatedDate").val(createdDate);
        $("#hdnAddressCreatedBy").val(createdBy);
        $("#hdnGISCode").val(gisCode);
        $("hdnLatitude").val(latitude);
        $("#hdnLongitude").val(longitude);
        $("#hdnAddressID").val(addressID);
        //console.log('this is the person ID' + personID);
        $("#hdnPersonID").val(personID);
    });


    function toggle() {
        $('#BingSearchModal').modal('toggle');
    }

    function addCSUEventListener(addressCell, resources) {
        addressCell.addEventListener('click', function(event) {
                        
            let selectedAddress = event.currentTarget.innerHTML;

            let filteredAddress = resources.filter(function(address) {
                return address.name === selectedAddress;
            });

            $("#txtCSUAddressLineOne").val(filteredAddress[0].address.addressLine);
            $("#txtCSUCity").val(filteredAddress[0].address.adminDistrict2);
            $("#txtCSUState").val(filteredAddress[0].address.adminDistrict);
            $("#txtCSUZip").val(filteredAddress[0].address.postalCode);

            toggle();

        }, false);
    }

    function addDJSEventListener(addressCell, resources) {
        addressCell.addEventListener('click', function(event) {
                        
            let selectedAddress = event.currentTarget.innerHTML;

            let filteredAddress = resources.filter(function(address) {
                return address.name === selectedAddress;
            });

            $("#txtDJSAddressLineOne").val(filteredAddress[0].address.addressLine);
            $("#txtDJSCity").val(filteredAddress[0].address.adminDistrict2);
            $("#txtDJSState").val(filteredAddress[0].address.adminDistrict);
            $("#txtDJSZip").val(filteredAddress[0].address.postalCode);

            toggle();

        }, false);
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
                console.log(resources);

                //setBingAddresses(resources);

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


                    if (txtAddressSearch === "txtDJSAddressSearch") {
                        addDJSEventListener(addressCell, resources);
                    }
                    else {
                        addCSUEventListener(addressCell, resources);
                    }                           
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

    function searchCSUBingClickHandler() {
        searchBing("txtCSUAddressSearch");
    }


    function djsSearchOnChangeEventHandler(event) {
        onChangeEventHandler(event, 1, "txtDJSAddressSearch");
    }

    function csuSearchOnChangeEventHandler(event) {
        onChangeEventHandler(event, 3, "txtCSUAddressSearch");
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

            //populateSearchBox(result, addressTypeId, searchBoxId);
            if (addressTypeId === 3) {
                populateSearchBox(result, searchBoxId, populateCSUFields);
            }  
            if (addressTypeId === 1) {
                populateSearchBox(result, searchBoxId, populateDJSFields);
            }

            //set the AddressTypeID
            $("#hdnAdddressTypeID").val(addressTypeId);

        });
    }

   
    document.addEventListener("click", function (e) {
        closeAllLists(e.target, "txtDJSAddressSearch");

        closeAllLists(e.target, "txtCSUAddressSearch");
    });

    function onKeyDownEventHandler(e) {
        onKeyDownHandler(e, "txtDJSAddressSearch");

    }

    function csuOnKeyDownEventHandler(e) {
        onKeyDownHandler(e, "txtCSUAddressSearch");
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
        };

        let addressId = $("#hdnAddressID").val();
        let methodType = '';

        if (addressId !== "") { //it's an existing record
            methodType = 'PUT';

            postData.ID = addressID;
            postData.PersonID = props.clientProfile.Person.ID; //$("#hdnPersonID").val();
            
            postData.UpdatedDate = new Date();
            postData.UpdatedBy = sessionStorageData.CurrentUser;
            postData.CreatedDate = $("#hdnAddressCreatedDate").val();
            postData.CreatedBy = $("#hdnAddressCreatedBy").val();

        } else { //it's a new record
            methodType = 'POST';

            postData.PersonID = props.clientProfile.Person.ID; //$("#hdnPersonID").val();

            postData.UpdatedDate = new Date();
            postData.UpdatedBy = sessionStorageData.CurrentUser;
            postData.CreatedDate = new Date();
            postData.CreatedBy = sessionStorageData.CurrentUser;
        }

        //the DJS fields are populated
        if (hdnAddressTypeID === "1" || hdnAddressTypeID === "2") {
            postData.AddressLineOne = $("#txtDJSAddressLineOne").val();
            postData.AddressLineTwo = $("#txtDJSAddressLineTwo").val();
            postData.Zip = $("#txtDJSZip").val();
            postData.CouncilDistrict = $("#txtDJSCouncilDistrict").val();

            //clear the CSU fields
            $("#txtCSUAddressLineOne").val("");
            $("#txtCSUAddressLineTwo").val("");
            $("#txtCSUZip").val("");
            $("#txtCSUCouncilDistrict").val("");
            $("#txtCSUCity").val("");
            $("#txtCSUState").val("");
        }

        //the CSU fields are populated
        if (hdnAddressTypeID === "3" || hdnAddressTypeID === "4") {
            postData.AddressLineOne = $("#txtCSUAddressLineOne").val();
            postData.AddressLineTwo = $("#txtCSUAddressLineTwo").val();
            postData.Zip = $("#txtCSUZip").val();
            postData.CouncilDistrict = $("#txtCSUCouncilDistrict").val();

            //clear the DJS fields
            $("#txtDJSAddressLineOne").val("");
            $("#txtDJSAddressLineTwo").val("");
            $("#txtDJSZip").val("");
            $("#txtDJSCouncilDistrict").val("");
            $("#txtDJSCity").val("");
            $("#txtDJSState").val("");
        }


        let apiAddress = sessionStorage.getItem("baseApiAddress");
        //let apiAddress = "http://localhost:57612";

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
            //console.log(result);
            if (result === null || result.Message !== undefined) {
                props.createErrorNotification("An error occurred while saving the adddress.");
                return;
            }

            if (result !== 0) {
                props.createNotification("The address was successfully updated.");
            }
        });

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
            <div className="col-6">
                <h5>CSU Address</h5>
                <div className="input-group mb-3">
                    <input type="text" placeholder="Start typing CSU Address" id="txtCSUAddressSearch" onKeyDown={csuOnKeyDownEventHandler} onChange={csuSearchOnChangeEventHandler} className="form-control" defaultValue = "" />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" onClick={searchCSUBingClickHandler}  >Search Bing</button>
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
            <div className="col-6">
                <label id="lblCSUAddressType"></label>
                <input type="text" placeholder="Address Line 1" id="txtCSUAddressLineOne" className="form-control" defaultValue=""/>
            </div>
        </div>
        <br></br>
        <div className="form-row">
            <div className="col-6">
                <input type="text" placeholder="Address Line 2" id="txtDJSAddressLineTwo" className="form-control" defaultValue=""/>
            </div>
            <div className="col-6">
                <input type="text" placeholder="Address Line 2" id="txtCSUAddressLineTwo" className="form-control" defaultValue=""/>
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
            <div className="form-group col-1">

            </div>
            <div className="form-group col-md-3">
                <input type="text" placeholder="City" id="txtCSUCity" className="form-control" defaultValue=""/>
            </div>
     
            <div className="form-group col-md-1">
                <input type="text" placeholder="State" id="txtCSUState" className="form-control" defaultValue=""/>
            </div>
            <div className="form-group col-md-1">
                <input type="text" className="form-control" placeholder="Zip" id="txtCSUZip" defaultValue=""/>
            </div>
        </div>
        <div className="form-row">
            <div className="form-group col-md-3">
                <input type="text" className="form-control" placeholder="Council District" id="txtDJSCouncilDistrict" defaultValue="" />
            </div>
            <div className="form-group col-md-3">
 
            </div>
            <div className="form-group col-md-3">
                <input type="text" className="form-control" placeholder="Council District" id="txtCSUCouncilDistrict" defaultValue="" />
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