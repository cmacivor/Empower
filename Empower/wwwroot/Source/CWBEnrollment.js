import React, { useState, useEffect } from 'react';
import $ from 'jquery';
//import modal from './bootstrap.js';
//import {modal} from './bootstrap.js';

const Enrollment = (props) => {

    let personId = '';
    let clientProfileId = '';

    if (props.clientProfile !== undefined) {
        personId = props.clientProfile.Person.ID;
        clientProfileId = props.clientProfileID.ID;
    }

    let assistanceTypes = props.assistanceTypeValues;
    let careerPathways = props.careerPathwayValues;

    useEffect(() => {

        document.getElementById("btnViewTanf").value = 'Please Select';
        document.getElementById("btnViewTanf").innerHTML = 'Please Select';

        document.getElementById("btnViewTanf").value = 'Please Select';
        document.getElementById("btnViewTanf").innerHTML = 'Please Select';

        document.getElementById("btnEnrollmentBenefits").value = 'Please Select';
        document.getElementById("btnEnrollmentBenefits").innerHTML = 'Please Select';

        document.getElementById("btnCareerPathwayPosition").value = 'Please Select';
        document.getElementById("btnCareerPathwayPosition").innerHTML = 'Please Select';

        document.getElementById("btnFullTimePartTime").value = 'Please Select';
        document.getElementById("btnFullTimePartTime").innerHTML = 'Please Select';

        document.getElementById("btnAssistanceType").value = 'Please Select';        
        document.getElementById("btnAssistanceType").innerHTML = 'Please Select';

        document.getElementById("btnCareerPathwayPosition").value = 'Please Select';
        document.getElementById("btnCareerPathwayPosition").innerHTML = 'Please Select';

     });

    function openEnrollmentModal() {
        //TODO: add function to clear the modal on opening
        $("#enrollmentModal").modal('toggle');
    }

    function ddlViewTanfSelectEventHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
      
        document.getElementById("btnViewTanf").value = selectedValue;

        let displayValue;
        if (selectedValue === "35") {
            displayValue = "Yes";
        } else if (selectedValue === "36") {
            displayValue = "No";
        }

        document.getElementById("btnViewTanf").innerHTML =  displayValue;
    }

    function ddlSnapSelectEventHandler(event) {
        //btnSnapEt
        let selectedValue = event.currentTarget.getAttribute('value');
      
        document.getElementById("btnSnapEt").value = selectedValue;

        let displayValue;
        if (selectedValue === "24") {
            displayValue = "Yes";
        } else if (selectedValue === "25") {
            displayValue = "No";
        }

        document.getElementById("btnSnapEt").innerHTML = displayValue; //selectedValue;
    }

    function ddlBenefitsSelectEventHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
      
        console.log(selectedValue);
        document.getElementById("btnEnrollmentBenefits").value = selectedValue;
        document.getElementById("btnEnrollmentBenefits").innerHTML = selectedValue;
    }

    function ddlCareerPathwayPositionSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        document.getElementById("btnCareerPathwayPosition").value = selectedValue;

        let selectedCareerPathway =  careerPathways.filter(function (careerPathway) {
            return careerPathway.ID === parseInt(selectedValue)
        });

        document.getElementById("btnCareerPathwayPosition").innerHTML = selectedCareerPathway[0].Description;
      
    }

    function ddlPartTimeFullTimeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
      
        document.getElementById("btnFullTimePartTime").value = selectedValue;
        document.getElementById("btnFullTimePartTime").innerHTML = selectedValue;
    }

    function ddlAssistanceTypeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnAssistanceType").value = selectedValue;
        
        let selectedAssistanceType =  assistanceTypes.filter(function (suffix) {
            return suffix.ID === parseInt(selectedValue)
        });

        document.getElementById("btnAssistanceType").innerHTML = selectedAssistanceType[0].Description;
    }

    function getElementValue(element) {
        let value = document.getElementById(element).value;

        if (value === "" || value === "Please Select") {
            return null;
        }
        return value;
    }

    function saveEnrollment() {
       
        let enrollmentDate = new Date($("#txtEnrollmentDate").val());
        let snapEt = new Date($("#txtSnapEt").val());


        let viewTanf = document.getElementById("btnViewTanf").value;

        if (snapEt === '') {
            $("#frmEnrollment").addClass("was-validated");
        }

        if (viewTanf === '') {
            $("#frmEnrollment").addClass("was-validated");
            document.getElementById("divViewTanfError").removeAttribute("style");
        }

        let placment ={
            AssistanceTypeID: getElementValue("btnAssistanceType") ,
            CareerPathwayID: getElementValue("btnCareerPathwayPosition"),
            ClientProfileID:  clientProfileId,
            CourtOrderDate: enrollmentDate,
            CourtOrderNarrative: getElementValue("txtEnrollmentComments"), //will be the comments
            EmployerBenefits: getElementValue("btnEnrollmentBenefits"),
            EmployerFullPartTime: getElementValue("btnFullTimePartTime"),
            EmployerName: getElementValue("txtEnrollmentEmployerName"),
            EmployerPosition: getElementValue("txtEnrollmentPosition"),
            EmployerStartDate: new Date($("#txtEnrollmentStartDate").val()),
            EmployerWages: getElementValue("txtEnrollmentWagesPerHour"),
            JudgeID: getElementValue("btnViewTanf"), //"Participating in VIEW/TANF"
            NextCourtDate: new Date($("#txtApptDate").val()), //Next Appt. Date
            PlacementLevelID: getElementValue("btnSnapEt") //10, //this is "Participating in SNAP-ET"
        }

        console.log(placment);

        //console.log(snapEt);
    }

    let assistanceTypeValueOptions = [];
    if ( assistanceTypes.length > 0) {

        assistanceTypeValueOptions = assistanceTypes.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ ddlAssistanceTypeSelectHandler  } className="dropdown-item">{value.Description}</a>
        );
    }

    let careerPathWayValueOptions = [];
    if ( careerPathways.length > 0) {

        careerPathWayValueOptions = careerPathways.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ ddlCareerPathwayPositionSelectHandler  } className="dropdown-item">{value.Description}</a>
        );
    }

    return <div>
        <h3>Program</h3>
        <br/>
        <button id="btnAddEnrollment" onClick={openEnrollmentModal} className="btn btn-primary">Add Enrollment</button>
        <form id="frmEnrollment">
            <div className="modal fade" id="enrollmentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Enrollment</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentDate"><strong>Enrollment Date</strong></label>
                                    <input type="date" defaultValue="" id="txtEnrollmentDate" className="form-control"></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtSnapEt"><strong> Participating in SNAP-ET *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnSnapEt" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            <a key="Please Select" value="Please Select" onClick={ ddlSnapSelectEventHandler } className="dropdown-item">Please Select</a>                                                
                                            <a key="24" value="24" onClick={ddlSnapSelectEventHandler} className="dropdown-item">Yes</a>
                                            <a key="25" value="25" onClick={ddlSnapSelectEventHandler} className="dropdown-item">No</a>
                                        </div>
                                    </div>
                                    <div style={{display:'none'}} id="divSnapEtError" className='errorDiv'>Please select a value.</div> 
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtNextApptDate"><strong>Next Appt. Date</strong> </label>
                                    <input type="date" defaultValue="" id="txtApptDate" className="form-control"></input>
                                </div>        
                            </div>
                            <br></br>
                            <div className="form-row">    
                                <div className="col-4">
                                    <label htmlFor="ddlViewTanf"><strong>Participating in VIEW/TANF *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnViewTanf" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            <a key="Please Select" value="Please Select" onClick={ddlViewTanfSelectEventHandler} className="dropdown-item">Please Select</a>                                                
                                            <a key="35" value="35" onClick={ddlViewTanfSelectEventHandler} className="dropdown-item">Yes</a>
                                            <a key="36" value="36" onClick={ddlViewTanfSelectEventHandler} className="dropdown-item">No</a>
                                        </div>
                                    </div>
                                    <div style={{display:'none'}} id="divViewTanfError" className='errorDiv'>Please select a value.</div> 
                                </div>
                                <div className="col-4">
                                    <label htmlFor="ddlAssistanceType"><strong>Assistance Type</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnAssistanceType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            { assistanceTypeValueOptions }
                                            {/* {maritalStatusValueOptions} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="form-row">
                                <div className="col-8">
                                    <label htmlFor="txtEnrollmentComments"><strong>Comments</strong></label>
                                    <textarea id="txtEnrollmentComments" type="text" defaultValue="" className="form-control"></textarea>
                                </div>
                            </div>
                            <br></br>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentEmployerName"><strong>Employer Name</strong></label>
                                    <input type="text" id="txtEnrollmentEmployerName" className="form-control"></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentPosition"><strong>Position</strong></label>
                                    <input type="text" id="txtEnrollmentPosition" className="form-control"></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentStartDate"><strong>Start Date</strong></label>
                                    <input id="txtEnrollmentStartDate" type="date" className="form-control"></input>
                                </div>
                            </div>
                            <br/>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentWagesPerHour"><strong>Wages ($ per hour)</strong></label>
                                    <input type="text" id="txtEnrollmentWagesPerHour" className="form-control"></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentBenefits"><strong>Benefits</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnEnrollmentBenefits" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            <a key="Please Select" value="Please Select" onClick={ ddlBenefitsSelectEventHandler } className="dropdown-item">Please Select</a>                                                
                                            <a key="Yes" value="Yes" onClick={ddlBenefitsSelectEventHandler} className="dropdown-item">Yes</a>
                                            <a key="No" value="No" onClick={ddlBenefitsSelectEventHandler} className="dropdown-item">No</a>
                                        </div>
                                    </div> 
                                </div>
                            
                            </div>
                            <br/>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="ddlPartTimeFullTime"><strong> Full or Part-Time</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnFullTimePartTime" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            <a key="Please Select" value="Please Select" onClick={ ddlPartTimeFullTimeSelectHandler  } className="dropdown-item">Please Select</a>                                                
                                            <a key="Full-Time" value="Full-Time" onClick={ddlPartTimeFullTimeSelectHandler} className="dropdown-item">Full-Time</a>
                                            <a key="Part-Time" value="Part-Time" onClick={ddlPartTimeFullTimeSelectHandler} className="dropdown-item">Part-Time</a>
                                        </div>
                                    </div> 
                                </div>
                                <div className="col-4">
                                    <label htmlFor="ddlCareerPathWayPosition" id="ddlCareerPathwayPosition"><strong> Career Pathway Position</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnCareerPathwayPosition" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            { careerPathWayValueOptions }
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={saveEnrollment} >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default Enrollment;