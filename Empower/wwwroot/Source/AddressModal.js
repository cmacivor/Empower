import React, { useState, useEffect } from 'react';
import { getSessionData } from './commonAdmin';
import {addActive, closeAllLists, removeActive, populateSearchBox, onKeyDownHandler, populateDJSFields, populateAmSearchFields } from './AutoComplete';
import $ from 'jquery';

const AddressModal = (props) => {

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
    let timeAtCurrentAddress = '';

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
            comments =(personInfo.Comments !== null) ? personInfo.Comments : '';
            timeAtCurrentAddress = (personInfo.TimeAtCurrentAddress !== null) ? personInfo.TimeAtCurrentAddress : '';
            gisCode = (personInfo.GISCode !== null ) ? personInfo.GISCode : '';
            latitude = (personInfo.Latitude !== null ) ? personInfo.Latitude : '';
            longitude = (personInfo.Longitude !== null) ? personInfo.Longitude : '';
            createdDate = (personInfo.CreatedDate !== null) ? personInfo.CreatedDate : '';
            createdBy = (personInfo.CreatedBy !== null) ? personInfo.CreatedBy : '';
        }
    }

    const [isBingSectionVisible, setIsBingSectionVisible] = useState(false);
    const [isRefreshed, setIsRefreshed] = useState(0);

    useEffect(() => {

        let sessionData = getSessionData();
        let roleId = sessionData.RoleID;

        $("#txtAmAddressLineOne").val(addressLineOne);
        $("#txtAmAddressLineTwo").val(addressLineTwo);
        $("#txtAmZip").val(addressZip);
        $("#txtAmComments").val(comments);
        $("#txtAmTimeCurrentAddress").val(timeAtCurrentAddress);

        //it's a DJS-City address
        if (addressTypeId === 1) {
            $("#txtAmCity").val('Richmond');
            $("#txtAmState").val('VA');
        }
        else { // it's a DJS non-city address
            $("#txtAmCity").val(city);
            $("#txtAmState").val(state);
        }
        
        $("#hdnAmAdddressTypeID").val(addressTypeId);
        $("#hdnAddressCreatedDate").val(createdDate);
        $("#hdnAddressCreatedBy").val(createdBy);
        $("#hdnGISCode").val(gisCode);
        $("hdnLatitude").val(latitude);
        $("#hdnLongitude").val(longitude);
        $("#hdnAddressID").val(addressID);
        $("#hdnPersonID").val(personID);

        $("#bingAlert").hide();
    });


    function searchBing(txtAddressSearch) {
        //let tableRef = document.getElementById("bingTable").getElementsByTagName('tbody')[0];

        let alertRef = document.getElementById("bingAlert");

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
                console.log(response);
                var resources = response.resourceSets[0].resources;
                
                document.getElementById("bingTableBody").innerHTML = "";

                resources.forEach(addressItem => {
                    //let iconCell = newRow.insertCell(0);
                    //let icon = document.createElement("i");
                    //icon.classList.add("fas");
                    //icon.classList.add("fa-arrow-down");
                    
                    let addressItemElement = document.createElement("p");
                    addressItemElement.innerText = addressItem.name;
                    addressItemElement.style = "cursor:pointer";
                    alertRef.appendChild(addressItemElement);
         
                    addDJSEventListener(addressItemElement, resources);     
                });
            },
            error: function(e) {
                console.log(e.statusText);
            }
        });
          
        $("#bingAlert").show();
        //toggle();
        //setIsBingSectionVisible(true);
    }

    function searchDJSBingClickHandler() {
        searchBing("txtAmAddressSearch");
    }

    function djsSearchOnChangeEventHandler(event) {
        onChangeEventHandler(event, 1, "txtAmAddressSearch");
    }

    //used in the bing search- when an address is selected from the pop-up 
    function addDJSEventListener(addressCell, resources) {
        addressCell.addEventListener('click', function(event) {
                        
            let selectedAddress = event.currentTarget.innerHTML;

            let filteredAddress = resources.filter(function(address) {
                return address.name === selectedAddress;
            });

            //console.log(filteredAddress[0].address.postalCode);

            $("#txtAmAddressLineOne").val(filteredAddress[0].address.addressLine);
            $("#hdnAmAdddressTypeID").val(2);
            $("#txtAmCity").val(filteredAddress[0].address.adminDistrict2);
            $("#txtAmState").val(filteredAddress[0].address.adminDistrict);
            $("#txtAmZip").val(filteredAddress[0].address.postalCode);

        }, false);
    }


    function onChangeEventHandler(event, addressTypeId, searchBoxId) {
        
        let input = event.target.value;
        
        let url = getSessionData().GisUrl;

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

            //populateSearchBox(result, 1, searchBoxId);
            populateSearchBox(result, searchBoxId, populateAmSearchFields);
        });

        //set the AddressTypeID
        $("#hdnAmAdddressTypeID").val(1);
    }

   
    document.addEventListener("click", function (e) {
        closeAllLists(e.target, "txtAmAddressSearch");
    });

    function onKeyDownEventHandler(e) {
        onKeyDownHandler(e, "txtAmAddressSearch");

    }

    function sameAsClientButtonClickHandler() {
        //console.log(props.ClientPersonID);

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let sessionStorageData = getSessionData();

        //let clientPersonID = $("#hdnCurrentFamilyMemberPersonID").val();

        let clientPersonAddressUrl = `${apiAddress}/api/PersonAddress/GetByPersonID/${props.ClientPersonID}`;

        fetch(clientPersonAddressUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {

            $("#hdnAmAdddressTypeID").val(result.AddressTypeID);
            $("#hdnAmAddressCreatedDate").val(result.CreatedDate);
            $("#hdnAmAddressCreatedBy").val(result.CreatedBy);
            $("#txtAmAddressLineOne").val(result.AddressLineOne);
            $("#txtAmAddressLineTwo").val(result.AddressLineTwo);
            $("#txtAmCity").val(result.City);
            $("#txtAmState").val(result.State);
            $("#txtAmZip").val(result.Zip);
            $("#txtAmComments").val(result.Comments);
            $("#txtAmTimeCurrentAddress").val(result.TimeAtCurrentAddress);

        });
    }


    function updateAddress() {

        let personID = $("#hdnCurrentFamilyMemberPersonID").val();

        let sessionStorageData = getSessionData();

        let hdnAddressTypeID = $("#hdnAmAdddressTypeID").val();

        let postData = {
            AddressTypeID: hdnAddressTypeID,
            GISCode: $("#hdnGISCode").val(),
            Latitude: $("#hdnLatitude").val(),
            Longitude: $("#hdnLongitude").val(),
            City: 'RICHMOND', 
            State: 'VA', 
            Active: true,
        };

        let addressId = $("#hdnAmAddressID").val();
        let methodType = '';

        if (addressId !== "") { //it's an existing record
            methodType = 'PUT';

            postData.ID = addressId;
            postData.PersonID = personID; //$("#hdnPersonID").val();
            
            postData.UpdatedDate = new Date();
            postData.UpdatedBy = sessionStorageData.CurrentUser;
            postData.CreatedDate = $("#hdnAmAddressCreatedDate").val();
            postData.CreatedBy = $("#hdnAmAddressCreatedBy").val();

        } else { //it's a new record
            methodType = 'POST';

            postData.PersonID = personID; //$("#hdnPersonID").val();

            postData.UpdatedDate = new Date();
            postData.UpdatedBy = sessionStorageData.CurrentUser;
            postData.CreatedDate = new Date();
            postData.CreatedBy = sessionStorageData.CurrentUser;
        }

            postData.AddressLineOne = $("#txtAmAddressLineOne").val();
            postData.AddressLineTwo = $("#txtAmAddressLineTwo").val();
            postData.Zip = $("#txtAmZip").val();
            //postData.CouncilDistrict = $("#txtDJSCouncilDistrict").val();
            postData.Comments = $("#txtAmComments").val();
            postData.TimeAtCurrentAddress = $("#txtAmTimeCurrentAddress").val();

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

        $('#addressModal').modal('toggle');

    }


    return <div>
            <div className="modal fade" id="addressModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Addresses</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div id="bingAlert" className="alert alert-success" role="alert">
                                        
                        </div>    
                        <br></br>
                        <input type="hidden" id="hdnAmAddressID" value="" />
                        <input type="hidden" id="hdnAmAdddressTypeID" value="" />
                        <input type="hidden" id="hdnAmAddressCreatedDate" value=""/>
                        <input type="hidden" id="hdnAmAddressCreatedBy" value="" />
                        <input type="hidden" id="hdnAmPersonID" value="" />
                        <input type="hidden" id="hdnAmGISCode" value="" />
                        <input type="hidden" id="hdnAmLatitude" value="" />
                        <input type="hidden" id="hdnAmLongitude" value="" />
                        <div className="form-row">
                            <h5>Family Member Address</h5>
                            <div className="input-group mb-3">
                                <input type="text" placeholder="Start typing Address Line"  onKeyDown={onKeyDownEventHandler} onChange={djsSearchOnChangeEventHandler} id="txtAmAddressSearch" className="form-control" defaultValue="" />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" onClick={searchDJSBingClickHandler} type="button">Search Bing</button>
                                </div>
                            </div>  
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <input type="text" placeholder="Address Line 1" id="txtAmAddressLineOne" className="form-control" defaultValue=""/>
                            </div>
                        </div>
                        <div className="form-row ">
                            <div className="form-group col-md-8">
                                <input type="text" placeholder="Address Line 2" id="txtAmAddressLineTwo" className="form-control" defaultValue=""/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <input type="text" placeholder="City" className="form-control" id="txtAmCity" defaultValue="Richmond"/>
                            </div>
                            <div className="form-group col-md-2">
                                <input type="text" placeholder="State" id="txtAmState" className="form-control" defaultValue="VA"/>
                            </div>
                            <div className="form-group col-md-2">
                                <input type="text" className="form-control" placeholder="Zip" id="txtAmZip" defaultValue=""/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <input type="text" className="form-control" placeholder="Comments" id="txtAmComments" defaultValue="" />
                            </div>          
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <input type="text" className="form-control" id="txtAmTimeCurrentAddress" placeholder="Time in Current Address" defaultValue="" />
                            </div>
                        </div>             
                    </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={ sameAsClientButtonClickHandler } >Same As Client</button>
                            <button type="button" onClick={updateAddress} className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
}

export default AddressModal;