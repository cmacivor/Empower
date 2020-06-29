import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';

const ProgressNote = (props) => {


    return <div>
             <form id="frmProgressNote">
                <div className="modal fade" id="progressNoteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Progress Note</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="btnServiceMonth"><strong> Date *</strong></label>
                                    <input type="date" id="txtProgressNoteDate" className="form-control" defaultValue="" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="btnProgressNoteComment">Comment</label>
                                    <textarea id="txtProgressNoteComments" className="form-control" defaultValue="" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="btnProgressNoteContactType"><strong> Contact Type</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnProgressNoteContactType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                          
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><i className="fa fa-arrow-up" aria-hidden="true"></i></td>
                                                <td><i className="fa fa-arrow-up" aria-hidden="true"></i></td>
                                            </tr>
                                            <tr>
                                                <td><input type="text" className="form-control"></input></td>
                                                <td><input type="text" className="form-control"></input></td>
                                            </tr>
                                            <tr>
                                                <td><i className="fa fa-arrow-down" aria-hidden="true"></i></td>
                                                <td><i className="fa fa-arrow-down" aria-hidden="true"></i></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                    
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="btnSaveProgressNote" className="btn btn-primary" >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default ProgressNote;