import moment from 'moment';

//this function is horrible, but it's what was being used in the original AngularJS application, 
//to generate the first value of the ID
//for example, it translates "MacIvor" into "M216"
var generateLCFromLastName = function (lastName) {

    var a = lastName.toLowerCase().split(''),
        f = a.shift(),
        r = '',
        codes = {
            a: '', e: '', i: '', o: '', u: '',
            b: 1, f: 1, p: 1, v: 1,
            c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
            d: 3, t: 3,
            l: 4,
            m: 5, n: 5,
            r: 6
        };

    r = f +
        a
            .map(function (v, i, a) { return codes[v] })
            .filter(function (v, i, a) {
                return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
            })
            .join('');

    return (r + '000').slice(0, 4).toUpperCase();

}

//this is even more horrific, but we have to use it because the old app is doing it
var EncodeFirstName = function (s) {
    var a = s.toUpperCase().split(''),

        r = '',
        Fixed = {
            ALBERT: 20, FRANK: 260, MARVIN: 580,
            ALICE: 20, GEORGE: 300, MARY: 580,
            ANN: 40, GRACE: 300, MELVIN: 600,
            ANNA: 40, HAROLD: 340, MILDRED: 600,
            ANNE: 40, HARRIET: 340, PATRICIA: 680,
            ANNIE: 40, HARRY: 360, PAUL: 680,
            ARTHUR: 40, HAZEL: 360, RICHARD: 740,
            BERNARD: 80, HELEN: 380, ROBERT: 760,
            BETTE: 80, HENRY: 380, RUBY: 740,
            BETTIE: 80, JAMES: 440, RUTH: 760,
            BETTY: 80, JANE: 440, THELMA: 820,
            CARL: 120, JAYNE: 440, THOMAS: 820,
            CATHERINE: 120, JEAN: 460, WALTER: 900,
            CHARLES: 140, JOAN: 480, WANDA: 900,
            DORTHY: 180, JOHN: 460, WILLIAM: 920,
            EDWARD: 220, JOSEPH: 480, WILMA: 920,
            ELIZABETH: 220, MARGARET: 560,
            FLORENCE: 260, MARTIN: 560,
            DONALD: 180,
            CLARA: 140
        };

    var exist = Fixed[s.toUpperCase()];
    if (exist != undefined)
        return exist;
    let codes = {
        A: 0, H: 320, O: 640, V: 860,
        B: 60, I: 400, P: 660, W: 880,
        C: 100, J: 420, Q: 700, X: 940,
        D: 160, K: 500, R: 720, Y: 960,
        E: 200, L: 520, S: 780, Z: 980,
        F: 240, M: 540, T: 800,
        G: 280, N: 620, U: 840
    };
    return (codes[a[0]]);

};

var EncodeInitial = function (middleName) {
    var a = middleName.toUpperCase().split(''),

        //r = '',

        codes = {
            A: 1, H: 8, O: 14, V: 18,
            B: 2, I: 9, P: 15, W: 19,
            C: 3, J: 10, Q: 15, X: 19,
            D: 4, K: 11, R: 16, Y: 19,
            E: 5, L: 12, S: 17, Z: 19,
            F: 6, M: 13, T: 18,
            G: 7, N: 14, U: 18
        };
    return (codes[a[0]]);
};

var replaceSpaceWithZero = function (s) {
    var Reverse = s.toString().split("").reverse().join("");
    s = (Reverse + '000' + s).slice(0, 3);
    var res = s.split("").reverse().join("");
    return res;
}

//hey, I know! Let's generate an ID in the most horribly confusing way possible! It'll be brilliant!
//Craig Edward MacIvor
//12/17/1982
//Gender: M
//Race: W
//produces: M216-105-82-497
export function GenerateUniqueID(lastName, firstName, middleName, dateOfBirth, genderID) {
    let encodedLastName = generateLCFromLastName(lastName);

    let encodedFirstName = parseInt(EncodeFirstName(firstName));

    let encodedMiddleName = parseInt(EncodeInitial(middleName));

    let birthDate = moment(dateOfBirth);

    let dayCode = ((birthDate.get('month') + 1) * 40) + birthDate.date() + ((parseInt(genderID) === 1) ? 500 : 0);

    //console.log(dayCode);

    let c = 0
    if (middleName === undefined || middleName === "") {
        c = encodedFirstName;
    } else {
        c = encodedFirstName + encodedMiddleName;
    }

    //console.log(c);
    c = replaceSpaceWithZero(c);
    dayCode = replaceSpaceWithZero(dayCode);


    //console.log(encodedLastName);
    //console.log(encodedFirstName);
    //console.log(encodedMiddleName);
    //console.log(dayCode);
    //console.log(c);

    let uniqueID = encodedLastName + '-' + c + '-' + (birthDate.get('year') % 100) + '-' + dayCode;
    return uniqueID;
}