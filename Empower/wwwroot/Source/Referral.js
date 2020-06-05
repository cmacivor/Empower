import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';

const Referral = (props) => {

    let careerAdvisors = props.staffValues;


    function ddlCareerAdvisorSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        console.log(selectedValue);
    }

    
    let careerAdvisorValueOptions = [];
    if ( careerAdvisors.length > 0) {

        careerAdvisorValueOptions = careerAdvisors.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ ddlCareerAdvisorSelectHandler  } className="dropdown-item">{value.Description}</a>
        );
    }

    return <div>
           <form id="frmReferral">
            <div className="modal fade" id="referralModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                    <label htmlFor="txtReferralDate"><strong>Referral Date</strong></label>
                                    <input type="date" defaultValue="" id="txtReferralDate" className="form-control"></input>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-6">
                                    <label htmlFor="ddlReferralDate"><strong>Career Advisor Name *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnCareerAdvisorName" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            { careerAdvisorValueOptions }
                                            {/* {maritalStatusValueOptions} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-4">
                                    <label><strong>Referral Source Details</strong></label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-3">
                                    <label><strong>Email</strong> </label>
                                </div>
                                <div className="col-3">
                                    <label><strong>Phone</strong></label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-3">
                                    <label><strong>Fax</strong></label>
                                </div>
                                <div className="col-3">
                                    <label><strong>Title</strong></label>
                                </div>
                            </div>            
                            <div className="form-row">
                                <div className="col-6">
                                    <label htmlFor="ddlReferralDate"><strong>Refer to this Service *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnReferToService" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            {/* {maritalStatusValueOptions} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-6">
                                    <label htmlFor="txtReferralNotes"><strong>Notes</strong></label>
                                    <textarea  className="form-control" defaultValue="" id="txtReferralNotes" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default Referral;