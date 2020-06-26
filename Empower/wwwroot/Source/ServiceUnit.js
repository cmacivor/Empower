

import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';



let serviceUnitYears = [];


const ServiceUnit = (props) => {
    return <div>
        <input type="hidden" id="hdnServiceUnitID" />
        <input type="hidden" id="hdnServiceUnitCreatedDate" />
        <input type="hidden" id="hdnServiceUnitCreatedBy" />
        <form id="frmServiceUnit">
            <div className="modal fade" id="serviceUnitModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                    <label htmlFor="btnServiceMonth"><strong> Month *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnServiceMonth" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                           
                                        </div>
                                    </div>
                                    {/* <div style={{display:'none'}} id="divServiceMonth" className='errorDiv'>Please select a value.</div>  */}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="btnServiceYear"><strong> Month *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnServiceYear" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="btnServiceUnits"><strong> Units *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnServiceUnits" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="divServiceUnitsTableContainer" className="form-row">

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default ServiceUnit;