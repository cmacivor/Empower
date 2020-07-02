import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';
import { generateTable, 
    getPlacementsByClientProfileID, 
    toggleCaseEnrollmentModal,
    createColumnGroup, 
    createRow } from './EnrollmentTabHelpers';

const EnrollmentCaseModal = (props) => {

    useEffect(() => {

    });

    

    return <div>
        <h3>Referral</h3>
        <br/>
        <button id="btnAddCaseEnrollment" onClick={toggleCaseEnrollmentModal} >Add Case Info</button>
              <form id="frmCaseEnrollment">
                <div className="modal fade" id="caseEnrollmentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                        <label htmlFor="txtCourtOrderDate"><strong>Court Order Date</strong></label>
                                        <input type="date" defaultValue="" id="txtCourtOrderDate" className="form-control"></input>
                                    </div>
                                    <div className="col-4">
                                        <div className="dropdown">
                                            <button type="button" id="btnOverallRisk" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                
                                            </button>
                                            <div className="dropdown-menu">

                                            </div>
                                        </div>
                                        <div style={{display:'none'}} id="divOverallRiskError" className='errorDiv'>Please select a value.</div> 
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-4">
                                        <label htmlFor="txtNextCourtDate"><strong>Next Cuort Date</strong></label>
                                        <input type="date" defaultValue="" id="txtNextCourtDate" className="form-control"></input>
                                    </div>
                                    <div className="col-4">
                                        <div className="dropdown">
                                            <button type="button" id="btnJudge" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                
                                            </button>
                                            <div className="dropdown-menu">

                                            </div>
                                        </div>
                                        <div style={{display:'none'}} id="divJudgeError" className='errorDiv'>Please select a value.</div> 
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id="btnSaveServiceUnit" className="btn btn-primary">Save</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
        </form>
    </div>
}

export default EnrollmentCaseModal;