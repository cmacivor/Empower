import React, { Component } from 'react';

export default class SearchClientProfile extends Component { 

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h4>Search Client Profiles</h4>
                <p>Please search for an existing Client Profile, before creating a new one.</p>
                <div className="form-row">
                    <div className="col-3">
                        <input type="text" class="form-control" placeholder="Enter Last Name"></input>
                    </div>
                    <div className="col-3">
                        <input type="text" className="form-control" placeholder="Enter First Name"></input>
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary mb-2">Search</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-primary mb-2">Clear Search</button>
                    </div>
                </div>
            </div>
        );
    }
}