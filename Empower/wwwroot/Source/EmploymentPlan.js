import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import { getPlacementsByClientProfileID, toggleEmploymentPlanModal } from './EnrollmentTabHelpers';
import {triggerToastMessage, triggerErrorMessage  } from './ToastHelper';

const EmploymentPlan = (props) => {


    function saveEmploymentPlan() {

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullPersonEmploymentPlanAddress = `${apiAddress}/api/EmploymentPlan`;
        let sessionStorageData = getSessionData();

        let employmentPlan = {
            EnrollmentID: $("#btnSaveEmploymentPlan").data("id"),
            EmploymentGoal: $("#txtEmploymentGoal").val(),
            EduTrainGoal: $("#txtEducationalTrainingGoal").val(),
            WorkExperience: $("#txtEPWorkExperience").val(),
            Strengths: $("#txtEPStrengths").val(),
            AddtlTraining: $("#txtAdditionalTrainingAttended").val(),
            Credentials: $("#txtCredentialsReceived").val(),
            Barriers: $("#txtBarriersToEmployment").val(),
            Active: true,
            CreatedDate: new Date(),
            CreatedBy: sessionStorageData.CurrentUser,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

        fetch(fullPersonEmploymentPlanAddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(employmentPlan)
        }).then(result => result.json())
        .then(result => {
            //console.log(result);

            if (result === null || result.Message !== undefined) {
                triggerErrorMessage("an error occurred while saving the record.");
                return;
            }

            triggerToastMessage('The enrollment was successfully saved.');

            toggleEmploymentPlanModal();

            getPlacementsByClientProfileID();
        });
    }

    return <div>
              <form id="frmEmploymentPlan">
            <div className="modal fade" id="employmentPlanModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Employment</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-header">
                                    Goals
                                </div>
                                <div className="card-body">
                                    <div className="form-row">
                                        <div className="col-12">
                                            <label htmlFor="txtEmploymentGoal"><strong>Employment Goal</strong></label>
                                            <textarea id="txtEmploymentGoal" className="form-control" defaultValue="" ></textarea>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col-12">
                                            <label htmlFor="txtEducationalTrainingGoal"><strong>Educational/Training Goal *</strong></label>
                                            <textarea id="txtEducationalTrainingGoal" className="form-control" defaultValue="" ></textarea>
                                        </div>
                                    </div>            
                                </div>
                            </div>
                            <br/>
                            <div id="occupationStrengthsAccordion">   
                                <div className="card">
                                    <div className="card-header">
                                        <a className="collapsed card-link" data-toggle="collapse" href="#occupationalStrengthDetails">
                                            Occupational Strengths
                                        </a>
                                    </div>
                                    <div id="occupationalStrengthDetails" className="collapse" data-parent="#occupationStrengthsAccordion">
                                        <div className="card-body">
                                            <div className="form-row">
                                                <div className="col-12">
                                                    <label htmlFor="txtEPWorkExperience"><strong>Work Experience</strong></label>
                                                    <textarea className="form-control" defaultValue="" id="txtEPWorkExperience" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-12">
                                                    <label htmlFor="txtEPStrengths"><strong>Strengths</strong></label>
                                                    <textarea className="form-control" defaultValue="" id="txtEPStrengths" className="form-control" />
                                                </div>
                                            </div>                                
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br></br>
                            <div id="educationalTrainingAccordion">
                                <div className="card">
                                    <div className="card-header">
                                        <a className="collapsed card-link" data-toggle="collapse" href="#educationTrainingDetails">
                                            Education and Training Strengths
                                        </a>
                                    </div>
                                    <div id="educationTrainingDetails" className="collapse" data-parent="#educationalTrainingAccordion">
                                        <div className="card-body">
                                            <div className="form-row">
                                                <div className="col-12">
                                                    <label htmlFor="txtAdditionalTrainingAttended"><strong>Addditional Training Attended</strong></label>
                                                    <textarea className="form-control" defaultValue="" id="txtAdditionalTrainingAttended" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-12">
                                                    <label htmlFor="txtCredentialsReceived"><strong>Credentials Received</strong></label>
                                                    <textarea className="form-control" defaultValue="" id="txtCredentialsReceived" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-12">
                                                    <label htmlFor="txtBarriersToEmployment"><strong>List all barriers to employment and how they will be addressed</strong></label>
                                                    <textarea className="form-control" defaultValue="" id="txtBarriersToEmployment" className="form-control" />
                                                </div>
                                            </div>                                    
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="btnSaveEmploymentPlan" onClick={saveEmploymentPlan} >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default EmploymentPlan;