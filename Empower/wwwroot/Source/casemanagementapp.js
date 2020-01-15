import React from 'react';
import ReactDOM from 'react-dom';
//import CaseManagement from './CaseManagement';
import CaseManagementFunction from  './CaseManagementFunction';
import {StoreProvider} from './store';

ReactDOM.render(
    <StoreProvider>
        <CaseManagementFunction/>
    </StoreProvider>,
    document.getElementById('root')
);