import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import { getRoles, getSystems } from './Constants';


const Assessment = (props) => {


    function addAssessment() {
        $("#assessmentModal").modal('toggle');
    }

    return <div>
        <br/>
        <button id="btnAddAssessment" onClick={addAssessment} className="btn btn-primary">Add Assessment</button>
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
                                        {/* {placementLevelOptions} */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <label htmlFor="btnAssessmentSubType"><strong>Domain</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnAssessmentSubType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        {/* {placementLevelOptions} */}
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
                                        {/* {placementLevelOptions} */}
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