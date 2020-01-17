import React, { useState, useEffect } from 'react';
//import { Api } from './commonAdmin';
import {  Api } from './commonAdmin';

export function useCacheService() {
    const [genders, setGenders] = useState([]);
    const [races, setRaces] = useState([]);

    useEffect(() => {
        Api.getConfigDataByType("Gender").then(genders => setGenders(genders));
        Api.getConfigDataByType("Race").then(races => setRaces(races));
    }, []);


    return {
        genderValues: genders,
        raceValues: races
    }
}