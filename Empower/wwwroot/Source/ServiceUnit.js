

import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';


function ddlServiceUnitYearSelectHandler(event) {
    let selectedValue = event.currentTarget.getAttribute('value');
    console.log(selectedValue);
}

let serviceUnitYears = [];
let currentYear = new Date().getFullYear();
let oldestYear = currentYear - 20;
// console.log("current year: " + currentYear);
// console.log("oldest: " + oldestYear);

var i;
for (i = 0; i < 20; i++) {
    oldestYear++;
    //console.log(oldestYear);
    serviceUnitYears.push(oldestYear);
  //text += "The number is " + i + "<br>";
  //yearToPrint = oldestYear + 1;
  //console.log(yearToPrint);
}

let serviceUnitYearOptions = serviceUnitYears.map((value) =>
    <a key={value} value={value}  onClick={ ddlServiceUnitYearSelectHandler  } className="dropdown-item">{value}</a>
 );

// if ( assistanceTypes.length > 0) {

//     assistanceTypeValueOptions = assistanceTypes.map((value) =>
//         <a key={value.ID} value={value.ID} description={value.Description} onClick={ ddlAssistanceTypeSelectHandler  } className="dropdown-item">{value.Name}</a>
//     );
// }


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
                            <h5 className="modal-title" id="exampleModalLabel">Service Units</h5>
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
                                    <label htmlFor="btnServiceYear"><strong> Years *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnServiceYear" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                           {serviceUnitYearOptions }
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