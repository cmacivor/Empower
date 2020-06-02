import React, { useState, useEffect } from 'react';
import $ from 'jquery';
//import modal from './bootstrap.js';
//import {modal} from './bootstrap.js';

const Enrollment = (props) => {

    //console.log(props.assistanceTypeValues);
    let assistanceTypes = props.assistanceTypeValues;

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

     });

    function openEnrollmentModal() {
        //TODO: add function to clear the modal on opening
        $("#enrollmentModal").modal('toggle');
    }

    function ddlViewTanfSelectEventHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
      
        console.log(selectedValue);
        document.getElementById("btnViewTanf").value = selectedValue;
        document.getElementById("btnViewTanf").innerHTML = selectedValue;
        
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
        document.getElementById("btnCareerPathwayPosition").innerHTML = selectedValue;
    }

    function ddlPartTimeFullTimeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
      
        document.getElementById("btnFullTimePartTime").value = selectedValue;
        document.getElementById("btnFullTimePartTime").innerHTML = selectedValue;
    }

    function ddlAssistanceTypeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnAssistanceType").value = selectedValue;
        
        let selectedSuffix =  suffixes.filter(function (suffix) {
            return suffix.ID === parseInt(selectedValue)
        });

        document.getElementById("btnAssistanceType").innerHTML = selectedSuffix[0].Description;
    }

    function saveEnrollment() {
       
        let enrollmentDate = new Date($("#txtEnrollmentDate").val());
        let snapEt = new Date($("#txtSnapEt").val());
        let nextApptDate = new Date($("txtNextApptDate#").val());

        let viewTanf = document.getElementById("btnViewTanf").value;

        if (snapEt === '') {
            $("#frmEnrollment").addClass("was-validated");
        }

        if (viewTanf === '') {
            $("#frmEnrollment").addClass("was-validated");
            document.getElementById("divViewTanfError").removeAttribute("style");
        }

        let placment ={
            AssistanceTypeID: 0,
            CareerPathwayID: 0,
            ClientProfileID: 0,
            CourtOrderDate: enrollmentDate,
            CourtOrderNarrative: '', //will be the comments
            EmployerBenefits: 'Yes',
            EmployerFullPartTime: 'FullTime',
            EmployerName: 'test employer',
            EmployerPosition: 'test position',
            EmployerStartDate: new Date(),
            EmployerWages: 100,
            JudgeID: 12,
            NextCourtDate: new Date(),
            PlacementLevelID: 10,
        }

        console.log(snapEt);
    }

    let assistanceTypeValueOptions = [];
    if ( assistanceTypes.length > 0) {

        assistanceTypeValueOptions = assistanceTypes.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ ddlAssistanceTypeSelectHandler  } className="dropdown-item">{value.Description}</a>
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
                                    <input type="date" defaultValue="" id="txtSnapEt" className="form-control" required ></input>
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
                                            <a key="Yes" value="Yes" onClick={ddlViewTanfSelectEventHandler} className="dropdown-item">Yes</a>
                                            <a key="No" value="No" onClick={ddlViewTanfSelectEventHandler} className="dropdown-item">No</a>
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
                                    <input type="text" id="txtEmployerName" className="form-control"></input>
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
                                <div className="col-4">
                                    <label htmlFor="ddlCareerPathWayPosition" id="ddlCareerPathwayPosition"><strong> Career Pathway Position</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnCareerPathwayPosition" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            <a key="Please Select" value="Please Select" onClick={ ddlCareerPathwayPositionSelectHandler } className="dropdown-item">Please Select</a>                                                
                                            <a key="Yes" value="Yes" onClick={ddlCareerPathwayPositionSelectHandler} className="dropdown-item">Yes</a>
                                            <a key="No" value="No" onClick={ddlCareerPathwayPositionSelectHandler} className="dropdown-item">No</a>
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