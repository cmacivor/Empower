import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';


const EmploymentPlan = (props) => {

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
                            <div id="accordion"> 
                                <div className="card">
                                    <div className="card-header">
                                        Goals
                                    </div>
                                    <div id="moreDetails" className="collapse" data-parent="#accordion">
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
                                </div>
                                <div className="card">
                                    <div className="card-header">
                                        <a className="collapsed card-link" data-toggle="collapse" href="#moreDetails">
                                            Occupational Strengths
                                        </a>
                                    </div>
                                    <div id="moreDetails" className="collapse" data-parent="#accordion">
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
                                <div className="card">
                                    <div className="card-header">
                                        <a className="collapsed card-link" data-toggle="collapse" href="#moreDetails">
                                            Education and Training Strengths
                                        </a>
                                    </div>
                                    <div id="moreDetails" className="collapse" data-parent="#accordion">
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
                            <button type="button" className="btn btn-primary" id="btnSaveEmploymentPlan"  >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default EmploymentPlan;