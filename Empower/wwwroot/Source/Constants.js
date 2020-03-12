export function getRoles() {
    let roles = {
        JuvenileSuperUser: 1,
        JuvenileAdmin: 2,
        JuvenileDJS: 3,
        JuvenileCSU: 4,
        AdultAdmin: 5,
        AdultCaseManager: 6,
        OCWBAdmin: 7,
        OCWBCaseManager: 8
    }

    return roles;
}

export function getSystems() {
    let systems = {
        Juvenile: 1,
        Adult: 2,
        OCWB: 3
    }

    return systems;
}