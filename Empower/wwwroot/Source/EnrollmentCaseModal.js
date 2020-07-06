import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';
import { generateTable, 
    getPlacementsByClientProfileID, 
    toggleCaseEnrollmentModal,
    createColumnGroup, 
    createRow, 
    populateServiceUnitModalTable} from './EnrollmentTabHelpers';
import { addActive, onKeyDownHandler, populatePlacementChargesBox  } from './AutoComplete';
import {  Api } from './commonAdmin';

const EnrollmentCaseModal = (props) => {

    let offenseValues = props.offenseValues;
    let placementLevels = props.placementLevelValues;

    useEffect(() => {

    });

    function overallRiskSelectHandler(event) {

    }


    function placementChargesOnKeyDownEventHandler(e) {
        onKeyDownHandler(e, "txtPlacementCharges");
    }

    function onPlacementChargeChangeEventHandler(event) {

        populatePlacementChargesBox(offenseValues, "txtPlacementCharges", populateChargeSelectionBox);
    }

    function populateChargeSelectionBox() {

    }

    let placementLevelOptions = [];
    if ( placementLevels.length > 0) {
        placementLevelOptions = placementLevels.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ overallRiskSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    return <div>
        <h3>Referral</h3>
        <br/>
        <button id="btnAddCaseEnrollment" className="btn btn-primary" onClick={toggleCaseEnrollmentModal} >Add Case Info</button>
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
                                    <div className="col-6">
                                        <div className="dropdown">
                                            <label htmlFor="btnOverallRisk"><strong>Overall Risk at Time of Placement *</strong></label>
                                            <button type="button" id="btnOverallRisk" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                
                                            </button>
                                            <div className="dropdown-menu">
                                                {placementLevelOptions}
                                            </div>
                                        </div>
                                        <div style={{display:'none'}} id="divOverallRiskError" className='errorDiv'>Please select a value.</div> 
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-4">
                                        <label htmlFor="txtNextCourtDate"><strong>Next Court Date</strong></label>
                                        <input type="date" defaultValue="" id="txtNextCourtDate" className="form-control"></input>
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="btnJudge"><strong>Judge *</strong></label>
                                        <div className="dropdown">
                                            <button type="button" id="btnJudge" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                
                                            </button>
                                            <div className="dropdown-menu">

                                            </div>
                                        </div>
                                        <div style={{display:'none'}} id="divJudgeError" className='errorDiv'>Please select a value.</div> 
                                    </div>
                                </div>
                                <div className="form-row">
                                    <label htmlFor="txtPlacementCharges"><strong>Placement Charges *</strong></label>
                                    <input id="txtPlacementCharges" onKeyDown={ placementChargesOnKeyDownEventHandler } onChange={ onPlacementChargeChangeEventHandler } className="form-control" />
                                </div>
                                <div id="divPlacementChargesContainer">

                                </div>
                                <br/>
                                <div className="form-row">
                                    <label><strong>Court Order Narrative</strong></label>
                                    <textarea id="txtCourtOrderNarrative" className="form-control"></textarea>
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