import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import { getRoles, getSystems } from './Constants';


const Assessment = (props) => {

    let assessmentTypes = props.assessmentTypeValues;
    let assessmentSubTypes = props.assessmentSubTypeValues;
    let staff = props.staffValues;

    useEffect(() => {
        document.getElementById('btnAssessmentType').value = 'Please Select';
        document.getElementById('btnAssessmentType').innerText = 'Please Select';

        document.getElementById('btnAssessmentSubType').value = 'Please Select';
        document.getElementById('btnAssessmentSubType').innerText = 'Please Select';

        document.getElementById('btnStaffPerson').value = 'Please Select';
        document.getElementById('btnStaffPerson').innerText = 'Please Select';
    });

    function assessmentTypeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        
        let selectedAssessmentType = assessmentTypes.filter(function(assessmentType) {
            return assessmentType.ID === parseInt(selectedValue);
        });

        $("#btnAssessmentType").val(selectedValue);

        document.getElementById("btnAssessmentType").innerText = selectedAssessmentType[0].Description;
    }

    function assessmentSubTypeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        let selectedAssessmentSubType = assessmentSubTypes.filter(function(assessmentSubType) {
            return assessmentSubType.ID === parseInt(selectedValue);
        });

        $("#btnAssessmentSubType").val(selectedValue);

        document.getElementById("btnAssessmentSubType").innerText = selectedAssessmentSubType[0].Description;
    }

    function staffSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        let selectedStaff = staff.filter(function(staff) {
            return staff.ID === parseInt(selectedValue);
        });

        $("#btnStaffPerson").val(selectedValue);

        document.getElementById("btnAssessmentSubType").innerText = selectedStaff[0].Description;
    }

    function addAssessment() {
        $("#assessmentModal").modal({show: true});
    }

    function getElementValue(element) {
        let value = document.getElementById(element).value;

        if (value === "" || value === "Please Select") {
            return null;
        }
        return value;
    }

    function saveAssessment() {
        let assessment = {

        }
    }

    let assessmentTypeOptions = [];
    if ( assessmentTypes.length > 0) {
        assessmentTypeOptions = assessmentTypes.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ assessmentTypeSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    let assessmentSubTypeOptions = [];
    if ( assessmentSubTypes.length > 0) {
        assessmentSubTypeOptions = assessmentSubTypes.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ assessmentSubTypeSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    let staffOptions = [];
    if ( staff.length > 0) {
        staffOptions = staffOptions.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ staffSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    return <div>
        <br/>
        <button type="button" id="btnAddAssessment" onClick={addAssessment} className="btn btn-primary">Add Assessment</button>
        <br/>
        <div className="modal fade" id="assessmentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Assessment</h5>
                        
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="btnAssessmentType"><strong>Assessment Type</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnAssessmentType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        { assessmentTypeOptions }
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <label htmlFor="btnAssessmentSubType"><strong>Domain</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnAssessmentSubType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        { assessmentSubTypeOptions }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="txtDateOfAssessment"><strong>Date of Assessment</strong></label>
                                <input type="date" id="txtDateOfAssessment" defaultValue="" className="form-control" />
                            </div>
                            <div className="col-6">
                                <label htmlFor="txtAssessmentScore">Assessment Score</label>
                                <input id="txtAssessmentScore" type="text" className="form-control" defaultValue="" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="btnStaffPerson"><strong>Staff Person</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnStaffPerson" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        { staffOptions }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="txtAssessmentNotes"><strong>Notes</strong></label>
                                <input type="text" className="form-control" id="txtAssessmentNotes" />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" id="btnSavePlacement" className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Assessment;