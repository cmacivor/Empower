

import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import { toggleServiceUnitModal } from './EnrollmentTabHelpers';
import {triggerToastMessage, triggerErrorMessage  } from './ToastHelper';


function ddlServiceUnitYearSelectHandler(event) {
    let selectedValue = event.currentTarget.getAttribute('value');
    //console.log(selectedValue);

    document.getElementById('btnServiceYear').value = selectedValue;
    document.getElementById("btnServiceYear").innerHTML = selectedValue;
}

function ddlServiceUnitMonthSelectHandler(event) {
    let selectedValue = event.currentTarget.getAttribute('value');

    document.getElementById('btnServiceMonth').value = selectedValue;
    document.getElementById("btnServiceMonth").innerHTML = selectedValue;
}

let serviceUnitYears = [];
let currentYear = new Date().getFullYear();
let oldestYear = currentYear - 20;
// console.log("current year: " + currentYear);
// console.log("oldest: " + oldestYear);

var i;
for (i = 0; i < 20; i++) {
    oldestYear++;
    serviceUnitYears.push(oldestYear);
}

function saveServiceUnit() {

    let apiAddress = sessionStorage.getItem("baseApiAddress");
    let fullServiceUnitAddress = `${apiAddress}/api/ServiceUnit`;
    let sessionStorageData = getSessionData();

    let serviceUnit = {
        EnrollmentID: $("#hdnServiceUnitEnrollmentID").val(),
        Year: document.getElementById('btnServiceYear').value,
        Month: document.getElementById('btnServiceMonth').value,
        Units: $("#txtServiceUnits").val(),
        SystemID: sessionStorageData.SystemID,
        Active: true,
        UpdatedDate: new Date(),
        UpdatedBy: sessionStorageData.CurrentUser
    }

    let methodType = '';

    if ($("#hdnServiceUnitID").val() !== "") {
        methodType = 'PUT';
        serviceUnit.CreatedDate = new Date($("#hdnServiceUnitCreatedDate").val());
        serviceUnit.CreatedBy = $("#hdnServiceUnitCreatedBy").val();

    } else {
        methodType = 'POST';
        serviceUnit.CreatedDate = new Date();
        serviceUnit.CreatedBy = sessionStorageData.CurrentUser;
    }

    fetch(fullServiceUnitAddress, {
        method: methodType,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorageData.Token
        },
        body: JSON.stringify(serviceUnit)
    }).then(result => result.json())
    .then(result => {
        console.log(result);

        if (result === null || result.Message !== undefined) {
            props.createErrorNotification("an error occurred while saving the record.");
            return;
        }

        //toggleServiceUnitModal();

        triggerToastMessage("The service unit was successfully saved");

    });
}


let serviceUnitYearOptions = serviceUnitYears.map((value) =>
    <a key={value} value={value}  onClick={ ddlServiceUnitYearSelectHandler  } className="dropdown-item">{value}</a>
 );


const ServiceUnit = (props) => {
    return <div>
        <input type="hidden" id="hdnServiceUnitID" />
        <input type="hidden" id="hdnServiceUnitEnrollmentID" />
        <input type="hidden" id="hdnServiceUnitCreatedDate" />
        <input type="hidden" id="hdnServiceUnitCreatedBy" />
        <form id="frmServiceUnit">
            <div className="modal fade" id="serviceUnitModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Service Units</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="btnServiceMonth"><strong> Month *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnServiceMonth" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                           <option value="1" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">JAN</option>
                                           <option value="2" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">FEB</option>
                                           <option value="3" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">MAR</option>
                                           <option value="4" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">APR</option>
                                           <option value="5" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">MAY</option>
                                           <option value="6" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">JUN</option>
                                           <option value="7" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">JUL</option>
                                           <option value="8" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">AUG</option>
                                           <option value="9" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">SEP</option>
                                           <option value="10" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">OCT</option>
                                           <option value="11" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">NOV</option>
                                           <option value="12" onClick={ddlServiceUnitMonthSelectHandler} className="dropdown-item">DEC</option>
                                        </div>
                                    </div>
                                    {/* <div style={{display:'none'}} id="divServiceMonth" className='errorDiv'>Please select a value.</div>  */}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="btnServiceYear"><strong> Years *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnServiceYear" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                           {serviceUnitYearOptions }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="txtServiceUnits"><strong> Units *</strong></label>
                                    <input type="text" className="form-control" id="txtServiceUnits" />
                                </div>
                            </div>
                            <div id="divServiceUnitsTableContainer" className="form-row">

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="btnSaveServiceUnit" className="btn btn-primary" onClick={ saveServiceUnit } >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default ServiceUnit;