import React, { Component } from 'react';

export default class SearchClientProfile extends Component { 

    constructor(props) {
        super(props);

        this.state = {
            isSearchButtonDisabled: true,
            firstName: '',
            lastName: ''
        }
    }

    ClearSearchFields = () => {
        this.setState({
            firstName: '',
            lastName: ''
        });
    }

    HandleSearchFieldChange = (event, field) => {
        this.setState({
            isSearchButtonDisabled: false,            
        });

        if (field === "firstname") {
            this.setState({
                firstName: event.target.value
            });
        }

        if (field === "lastname") {
            this.setState({
                lastName: event.target.value
            });
        }
    }

    SearchButtonClickHandler = () => {
        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");
        
        let fullSearchAddress = `${apiAddress}/api/ClientProfile/Search`;

        let postData = {
            lastName: this.state.lastName
        }

        try
        {
           var result = fetch(fullSearchAddress, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(postData)
            }); 

            console.log(result);
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while searching;');
        }
    }

    render() {
        return (
            <div>
                <br></br>
                <h4>Search Client Profiles</h4>
                <p>Please search for an existing Client Profile, before creating a new one.</p>
                <div className="form-row">
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={e => this.HandleSearchFieldChange(e, "lastname")} value={this.state.lastName}  placeholder="Enter Last Name"></input>
                    </div>
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={e => this.HandleSearchFieldChange(e, "firstname")} value={this.state.firstName} placeholder="Enter First Name"></input>
                    </div>
                    <div className="col-auto">
                        <button type="submit" onClick={this.SearchButtonClickHandler}  disabled={this.state.isSearchButtonDisabled} className="btn btn-primary mb-2">Search</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={this.ClearSearchFields} className="btn btn-primary mb-2">Clear Search</button>
                    </div>
                </div>
            </div>
        );
    }
}