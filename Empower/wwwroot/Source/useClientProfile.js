import React, { useState } from 'react';

 export function useClientProfile(props) {
    const [lastName, setLastName] = useState('Craig');
    const [firstName, setFirstName] = useState('MacIvor');

    return {
        lastName: lastName,
        firstName: firstName
    }
}




