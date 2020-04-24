import React, { useState, useEffect } from 'react';
import { EditingState, PagingState, IntegratedPaging, RowDetailState, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditColumn, TableFixedColumns, PagingPanel, TableRowDetail } from '@devexpress/dx-react-grid-bootstrap4';
import moment from 'moment';
import {getSessionData } from './commonAdmin';
import {useStore} from './StateStores/store';
import {Toast } from 'react-bootstrap';
import {FaTrash, FaExchangeAlt} from 'react-icons/fa';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import { GenerateUniqueID } from './NewClient';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getRoles } from './Constants';


const SearchJuvenile = (props) => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [ isAddNewProfileButtonVisible, setAddNewProfileButtonVisible ] = useState(false);
    const [ canSearch21Plus, setCanSearch21Plus] = useState(false);
    const [searchCount, setSearchCount] = useState(0);
    const [isSearchCountVisible, setIsSearchCountVisible] = useState(false);
    const [isSearchButtonEnabled, setIsSearchButtonDisabled] = useState(true);
    //for the merge button?
    const [editingRowIds, getEditingRowIds] = useState([]);
    const [addedRows, setAddedRows] = useState([]);
    const [rowChanges, setRowChanges] = useState({});

    //grid state
    const [columns] = useState([
        { name: 'FirstName', title: 'First Name' },
        { name: 'LastName', title: 'Last Name' },
        { name: 'MiddleName', title: 'Middle Name' },
        { name: 'JTS', title: 'JTS #' },
        { name: 'SSN', title: 'SSN' },
        { name: 'FormattedBirthDate', title: 'Birth Date' }, 
        { name: 'Gender', title: 'Gender' },
        { name: 'PersonID', title: 'ID'}        
      ]);

      const [search21PluGridColumns] = useState([
        { name: 'FirstName', title: 'First Name' },
        { name: 'LastName', title: 'Last Name' },
        { name: 'MiddleName', title: 'Middle Name' },
        { name: 'JTS', title: 'JTS #' },
        { name: 'SSN', title: 'SSN' },
        { name: 'FormattedBirthDate', title: 'Birth Date' }, 
        { name: 'Gender', title: 'Gender' },        
      ]);

     const [isSuperUser, setIsSuperUser] = useState(false);
     const [isAdmin, setIsAdmin]  = useState(false);

     const [rows, setRows] = useState([]);
     const [isGridVisible, setGridVisible] = useState(false);
     const [canDeleteRow, setCanDeleteRow ] = useState(false);
     const [canMergeProfiles, setCanMergeProfiles] = useState(true);
     const [leftFixedColumns] = useState([TableEditColumn.COLUMN_TYPE]);
     const [sorting, setSorting] = useState([]);

     //main search grid paging params
     const [currentPage, setCurrentPage] = useState(0);
     const [pageSize, setPageSize] = useState(5);
     const [pageSizes] = useState([5, 10, 15]);
     
     //Search21Plus grid items
     const [search21PlusGridRows, setSearch21PlusGridRows] = useState([]);
     const [isSearch21PlusGridVisible, setIsSearch21PlusGridVisible ] = useState(false);
     const [search21GridLeftFixedColumns] = useState([TableEditColumn.COLUMN_TYPE]);
     //paging
     const [search21CurrentPage, setSearch21CurrentPage] = useState(0);
     const [search21PageSize, setSearch21PageSize] = useState(5);
     const [search21PageSizes] = useState([5, 10, 15]);

     const [modal, setModal] = useState(false);
     const [mergeOptions, setMergeOptions ] = useState([]);
     //const toggle = () => setModal(!modal);
     //const [mergeModalTableRows, setMergeModalTableRows] = useState('');

     //to test the global state
     const {state, dispatch} = useStore();


      let sessionStorageData = getSessionData();
      let apiAddress = sessionStorage.getItem("baseApiAddress");

      const Search21GridCommandButton = ({ 
        onExecute, icon, text, hint, color,
      }) => (
        <button
          type="button"
          className="btn btn-danger btn-sm"
         
          style={{ padding: 3 }}
          onClick={(e) => {
            onExecute();
            e.stopPropagation();
          }}
          title={hint}
         >
           <span>
             <FaTrash />
           </span>
        </button>
      );

      useEffect(() => {
        let roles = getRoles();
      
        if (parseInt(sessionStorageData.RoleID) === roles.JuvenileSuperUser)  { 
          setIsSuperUser(true);
        }

        if (parseInt(sessionStorageData.RoleID) === roles.JuvenileAdmin) {
          setIsAdmin(true);
        }

        //set permissions
        if (parseInt(sessionStorageData.RoleID) === roles.JuvenileSuperUser)  {
          setCanSearch21Plus(true);
        }

        
      }, [mergeOptions] );

     

      const DeleteButton = ({ onExecute }) => (
        <button
            type="button"
            className="btn btn-danger btn-sm"
          
            style={{ padding: 3 }}
            onClick={(e) => {
              if (window.confirm('Are you sure you want to delete this row?')) {
                onExecute();
              }
              e.stopPropagation();
            }}
            title={'Delete this client record'}
          >   
            <FaTrash />
      </button>
      );

      const Search21GridDeleteButton = ({ onExecute }) => (
        <Search21GridCommandButton
          icon="trash"
          hint="Delete row"
          color="text-danger"
          onExecute={() => {
            // eslint-disable-next-line
            if (window.confirm('Are you sure you want to delete this row?')) {
              onExecute();
            }
          }}
        />
      );

      const deleteCommandComponents = {
        delete: DeleteButton
      }

  
      const search21PlusCommandComponents = {
        delete: Search21GridDeleteButton,
      };

      const DeleteCommand = ({ id, onExecute }) => {
        const ButtonComponent = deleteCommandComponents[id];
        return (
          <ButtonComponent 
            onExecute={onExecute}
          />
        );
      };

      // const SuperUserCommand = ({ id, onExecute }) => {
      //   const ButtonComponent = deleteCommandComponents[id];
      //   return (
      //     <ButtonComponent 
      //       onExecute={onExecute}
      //     />
      //   );
      // };



      const Search21PlusCommand = ({ id, onExecute }) => {
        const ButtonComponent = search21PlusCommandComponents[id];
        return (
          <ButtonComponent
            onExecute={onExecute}
          />
        );
      };

      const deleteRows = (deletedIds, isSearch21Grid) => {
        let rowsForDelete;
        if (!isSearch21Grid) {
          rowsForDelete = rows.slice();
        } else {
          rowsForDelete = search21PlusGridRows.slice();
        }

        deletedIds.forEach((rowId) => {
          const index = rowsForDelete.findIndex(row => row.id === rowId);
          if (index > -1) {
            rowsForDelete.splice(index, 1);
          }
        });
        return rowsForDelete;
      };

      const commit21SearchGridChanges = ({ added, changed, deleted }) => {
        let changedRows;
        // if (added) {
        //   const startingAddedId = search21PlusGridRows.length > 0 ? search21PlusGridRows[rows.length - 1].id + 1 : 0;
        //   changedRows = [
        //     ...search21PlusGridRows,
        //     ...added.map((row, index) => ({
        //       id: startingAddedId + index,
        //       ...row,
        //     })),
        //   ];
        // }
        // if (changed) {
        //   changedRows = search21PlusGridRows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
        // }
        if (deleted) {
            let index = deleted[0];
            let deletedRow = search21PlusGridRows[index];
            deleteClient(deletedRow.ID, true);
          changedRows = deleteRows(deleted, true);
        }
        setRows([]);
        setGridVisible(false);
        setSearch21PlusGridRows(changedRows);
      
      };

      const commitChanges = ({ added, changed, deleted }) => {
        let changedRows;
        // if (added) {
        //   const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
        //   changedRows = [
        //     ...rows,
        //     ...added.map((row, index) => ({
        //       id: startingAddedId + index,
        //       ...row,
        //     })),
        //   ];
        // }
        // if (changed) {
        //   changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
        // }
        if (deleted) {
            let index = deleted[0];
            let deletedRow = rows[index];
            deleteClient(deletedRow.ID, false);
          changedRows = deleteRows(deleted, false);
        }

        setSearch21PlusGridRows([]);
        setIsSearch21PlusGridVisible(false);
        setRows(changedRows);
      };


    function SetClientProfile(clientProfile) {
         props.hideSpinner();
         props.onSearchGridRowClick(clientProfile);
     }

    function handleLastNameChange (event)  {
        setLastName(event.target.value);
        setIsSearchButtonDisabled(false);
    }

    function handleFirstNameChange (event) {
        setFirstName(event.target.value);
        setIsSearchButtonDisabled(false);
    }

    function Search21PlusClickHandler() {
        
         let fullSearchAddress = `${apiAddress}/api/ClientProfile/SearchPlus`;
 
         try
         {
            var promise = fetch(fullSearchAddress, {
                 method: 'get',
                 mode: 'cors',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': 'Bearer ' + sessionStorageData.Token
                 }
                 //body: JSON.stringify(postData)
             }); 
 
             promise.then(result =>  {
                 if (result.status === 200) {
                     return result.json();
                 
                 } else {
                     return result.json();
                 } 
     
             }).then(finalResult => {
                setRows([]);
                 setGridVisible(false);
                 setSearch21PlusGridRows(finalResult);
                 setIsSearch21PlusGridVisible(true);
                 
                 setSearchCount(finalResult.length)
             
                 setAddNewProfileButtonVisible(true);
                 setIsSearchCountVisible(true);
                        
             });
         }
         catch(error)
         {
             console.log(error);
             alert('an error occurred while searching;');
         }
    }


    function SearchButtonClickHandler() {
        
        let fullSearchAddress = `${apiAddress}/api/ClientProfile/Search`;

        let postData = {
            lastName: lastName,
            firstName: firstName
        }

        try
        {
           var promise = fetch(fullSearchAddress, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                },
                body: JSON.stringify(postData)
            }); 

            promise.then(result =>  {
                if (result.status === 200) {
                    return result.json();
                
                } else {
                    return result.json();
                } 
    
            }).then(finalResult => {
                setSearch21PlusGridRows([]);
                setIsSearch21PlusGridVisible(false);
                setRows(finalResult);
                setGridVisible(true);
                setAddNewProfileButtonVisible(true);
                setSearchCount(finalResult.length);
                setIsSearchCountVisible(true);        
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while searching;');
        }
    }

   const TableComponent = ({ ...restProps }) => (
        <Table.Table
          {...restProps}
          className="table-hover"
        />
      );

   const TableRow = ({ row, ...restProps }) => (
        <Table.Row
          {...restProps}
          onClick={() => GetSelectedRow(row) }/>
      );

    function ClearSearchFields() {
        setLastName('');
        setFirstName('');
    }

    

    function deleteClient(personID, isSearch21Grid) {
        
        let clientProfileAddress = `${apiAddress}/api/ClientProfile/DeleteClient/${personID}`;

        try
        {
           var promise = fetch(clientProfileAddress, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                }               
            }); 

            promise.then(result =>  {
                if (result.status === 200) {
                    return result.json();
                
                } else {
                    return result.json(); //TODO: fix this
                } 
    
            }).then(finalResult => {
                if (!isSearch21Grid) {
                  SearchButtonClickHandler();
                } else {
                  Search21PlusClickHandler();
                }

                props.createNotification('The client profile was successfully deleted.');
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while retrieving the Client Profile;');
        }
    }

    function GetSelectedRow(row) {
      
        props.enableTabsHandler();

        props.showSpinner();
        
        let clientProfileAddress = `${apiAddress}/api/ClientProfile/${row.ID}`;

        try
        {
           var promise = fetch(clientProfileAddress, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token 
                }               
            }); 

            promise.then(result =>  {
                if (result.status === 200) {
                    return result.json();
                
                } else {
                    return result.json();
                } 
    
            }).then(finalResult => {
                console.log(finalResult);
                SetClientProfile(finalResult);
                dispatch( { type: "existingClient"} ); 
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while retrieving the Client Profile;');
        }
    }

    function addNewProfileClickHandler() {
        dispatch( { type: "newClient"} );
        props.setParticipantInfoAsActiveTab("participantinfo");
    }

  

    return <div>
                <br></br>
                <h4>Search Client Profiles</h4>
                <div className="form-row">
                  <div className="col-6">
                      <p>Please search for an existing Client Profile, before creating a new one.</p>
                  </div>
                  {
                     isSearchCountVisible ?
                     <div className="col-6">
                        <strong>Found {searchCount} matching Profiles</strong>
                    </div> : <div></div>
                  }
                
                </div>

                <div className="form-row">
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={handleLastNameChange} value={lastName}  placeholder="Enter Last Name"></input>
                    </div>
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={handleFirstNameChange} value={firstName} placeholder="Enter First Name"></input>
                    </div>
                    <div className="col-auto">
                        <button type="submit" onClick={SearchButtonClickHandler} disabled={isSearchButtonEnabled}  className="btn btn-primary mb-2">Search</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={ClearSearchFields} className="btn btn-primary mb-2">Clear Search</button>
                    </div>
                    {
                       canSearch21Plus ?
                       <div className="col-auto">
                          <button type="button" onClick={Search21PlusClickHandler} className="btn btn-primary mb-2">Search21plus</button>
                       </div> : <div></div>
                    }
                    {
                        isAddNewProfileButtonVisible ? <div className="col-auto">
                            <button type="button" onClick={addNewProfileClickHandler} className="btn btn-primary mb-2">Add New Profile</button>
                        </div> : <div></div>
                    }
                </div>
                <br/>
                <br/>
                {
                  //this grid is for CSU and DJS users. They can't delete rows or merge
                    isGridVisible === true && !isAdmin && !isSuperUser ?
                    
                    <Grid className="card"
                        rows={rows }
                        columns={columns}>
                      <SortingState
                        sorting={sorting}
                        onSortingChange={setSorting}
                       />
                       <IntegratedSorting />
                      <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                       />
                        <IntegratedPaging/>
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow showSortingControls />
                        <PagingPanel pageSizes={pageSizes} />
                    </Grid> : <div></div> 
                       
                }
                {
                  //this grid is for Admin users. Admins can delete a row, but cannot merge.
                    isGridVisible === true  ?
                    
                    <Grid className="card"
                        rows={rows }
                        columns={columns}
                      >
                      <SortingState
                        sorting={sorting}
                        onSortingChange={setSorting}
                       />
                       <IntegratedSorting />
                      <RowDetailState/>
                      <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                       />
                       <IntegratedPaging/>
                        <EditingState
                            onCommitChanges={commitChanges}
                            
                            editingRowIds={editingRowIds}
                            onEditingRowIdsChange={getEditingRowIds}
                            rowChanges={rowChanges}
                            onRowChangesChange={setRowChanges}
                         />
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow showSortingControls />

                        <PagingPanel pageSizes={pageSizes} />
                       
                         <TableEditColumn width="60"
                        showDeleteCommand  commandComponent={DeleteCommand} />
                        <TableFixedColumns 
                            rightColumns={leftFixedColumns} /> 
                      
                    </Grid> : <div></div> 
                }
                {/* {
                  //this grid is forSuper users. Super users can delete and merge
                    isGridVisible === true && isSuperUser ?
                    
                    <Grid className="card"
                        rows={rows }
                        columns={columns}
                      >
                      <SortingState
                        sorting={sorting}
                        onSortingChange={setSorting}
                       />
                       <IntegratedSorting />
                      <RowDetailState/>
                      <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                       />
                       <IntegratedPaging/>
                        <EditingState
                            onCommitChanges={commitChanges}
                            
                            editingRowIds={editingRowIds}
                            onEditingRowIdsChange={getEditingRowIds}
                            rowChanges={rowChanges}
                            onRowChangesChange={setRowChanges}
                         />
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow showSortingControls />

                        <PagingPanel pageSizes={pageSizes} />
                       
                        <TableEditColumn width="60"
                        showDeleteCommand  commandComponent={DeleteCommand} />
                        <TableFixedColumns 
                            rightColumns={leftFixedColumns} />
                      
                    </Grid> : <div></div> 
                } */}
                {
                  isSearch21PlusGridVisible === true ?

                  <Grid className="card"
                      rows={search21PlusGridRows }
                      columns={search21PluGridColumns}>
                        <SortingState
                        sorting={sorting}
                        onSortingChange={setSorting}
                       />
                       <IntegratedSorting />
                      <PagingState
                        currentPage={search21CurrentPage}
                        onCurrentPageChange={setSearch21CurrentPage}
                        pageSize={search21PageSize}
                        onPageSizeChange={setSearch21PageSize}
                       />
                       <IntegratedPaging/>
                      <EditingState
                          onCommitChanges={commit21SearchGridChanges}
                          editingRowIds={editingRowIds}
                          onEditingRowIdsChange={getEditingRowIds}
                          rowChanges={rowChanges}
                          onRowChangesChange={setRowChanges}
                           
                      />
                      <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                      <TableHeaderRow showSortingControls />
                      <PagingPanel pageSizes={search21PageSizes} />
                      <TableEditColumn width="60"
                      showDeleteCommand commandComponent={Search21PlusCommand} />
                      <TableFixedColumns 
                          rightColumns={search21GridLeftFixedColumns} 
                      />
                  </Grid> : <div></div> 
                }
 
            </div>;
}

export default SearchJuvenile;