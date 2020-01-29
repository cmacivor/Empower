import React, { useState, useEffect } from 'react';
import {  Api } from './commonAdmin';

export function useCacheService() {
    const [genders, setGenders] = useState([]);
    const [races, setRaces] = useState([]);
    const [suffixes, setSuffixes] = useState([]);
    const [educationLevels, setEducationLevels] = useState([]);
    const [fundingSources, setFundingSources] = useState([]);
    const [jobStatuses, setJobStatuses] = useState([]);
    const [maritalStatuses, setMaritalStatuses] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);

    useEffect(() => {
        Api.getConfigDataByType("Gender").then(genders => setGenders(genders));
        Api.getConfigDataByType("Race").then(races => setRaces(races));
        Api.getConfigDataByType("EducationLevel").then(educationLevels => setEducationLevels(educationLevels));
        Api.getConfigDataByType("FundingSource").then(fundingSources => setFundingSources(fundingSources));
        Api.getConfigDataByType("Suffix").then(suffixes => setSuffixes(suffixes));
        Api.getConfigDataByType("JobStatus").then(jobStatuses => setJobStatuses(jobStatuses)); 
        Api.getConfigDataByType("MaritalStatus").then(maritalStatuses => setMaritalStatuses(maritalStatuses));
        Api.getConfigDataByType("PropertyType").then(propertyTypes => setPropertyTypes(propertyTypes));
    }, []);


    return {
        genderValues: genders,
        raceValues: races,
        suffixValues: suffixes,
        educationLevelValues: educationLevels,
        fundingSourceValues: fundingSources,
        jobStatusValues: jobStatuses,
        maritalStatusValues: maritalStatuses,
        propertyTypeValues: propertyTypes
    }
}