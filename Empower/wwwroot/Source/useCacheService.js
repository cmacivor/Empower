import React, { useState } from 'react';
//import { Api } from './commonAdmin';
import {  Api } from './commonAdmin';

export function useCacheService() {
    const [genders, setGenders] = useState([]);

    Api.getConfigDataByType("Gender").then(genders => setGenders(genders));

    return {
        genderValues: genders
    }
}