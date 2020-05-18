import React, { useState, useEffect } from 'react';
import { getSessionData } from './commonAdmin';
import $ from 'jquery';

const AddressModal = (props) => {



    return <div>
            <div className="modal fade" id="possibleDuplicatesModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Duplicates</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="col-6">
                            <br></br>
                                <input type="hidden" id="hdnAmAddressID" value="" />
                                <input type="hidden" id="hdnAmAdddressTypeID" value="" />
                                <input type="hidden" id="hdnAmAddressCreatedDate" value=""/>
                                <input type="hidden" id="hdnAmAddressCreatedBy" value="" />
                                <input type="hidden" id="hdnAmPersonID" value="" />
                                <input type="hidden" id="hdnAmGISCode" value="" />
                                <input type="hidden" id="hdnAmLatitude" value="" />
                                <input type="hidden" id="hdnAmLongitude" value="" />
                                <div className="form-row">
                                    <div className="col-6">
                                        <h5>Family Member Address</h5>
                                        <div className="input-group mb-3">
                                            <input type="text" placeholder="Start typing Address Line"  onKeyDown={onKeyDownEventHandler} onChange={djsSearchOnChangeEventHandler} id="txtAmAddressSearch" className="form-control" defaultValue="" />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary" onClick={searchDJSBingClickHandler} type="button">Search Bing</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-6">
                                        <label id="lblDJSAddressType"></label>
                                        <input type="text" placeholder="Address Line 1" id="txtAmAddressLineOne" className="form-control" defaultValue=""/>
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-6">
                                        <input type="text" placeholder="Address Line 2" id="txtAmAddressLineTwo" className="form-control" defaultValue=""/>
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                        <input type="text" placeholder="City" className="form-control" id="txtAmCity" defaultValue="Richmond"/>
                                    </div>
                                    <div className="form-group col-md-1">
                                        <input type="text" placeholder="State" id="txtAmState" className="form-control" defaultValue="VA"/>
                                    </div>
                                    <div className="form-group col-md-1">
                                        <input type="text" className="form-control" placeholder="Zip" id="txtAmZip" defaultValue=""/>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                        <input type="text" className="form-control" placeholder="Comments" id="txtAmComments" defaultValue="" />
                                    </div>          
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                        <input type="text" className="form-control" id="txtAmTimeCurrentAddress" placeholder="Time in Current Address" defaultValue="" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-8">          
                                    </div>
                                    <div className="col-auto">
                                        <button id="btnAmUpdateAddress" className="btn btn-primary" onClick={updateAddress} >Update</button>
                                    </div>
                                    <div className="col-auto">
                                        <button type="button" onClick={() => setIsRefreshed(isRefreshed + 1)}  className="btn btn-primary mb-2">Reset</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">Save New</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
}

export default AddressModal;