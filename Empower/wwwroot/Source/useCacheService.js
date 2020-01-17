import React, { useState, useEffect } from 'react';
//import { Api } from './commonAdmin';
import {  Api } from './commonAdmin';

export function useCacheService() {
    const [genders, setGenders] = useState([]);

    useEffect(() => {
        Api.getConfigDataByType("Gender").then(genders => setGenders(genders));
    }, []);


    return {
        genderValues: genders
    }
}