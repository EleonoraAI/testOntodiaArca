import ontodiaLogoSvg from '../../node_modules/arca-ontodia/images/ontodia-logo.svg';
const ONTODIA_WEBSITE = 'http://arca.diag.uniroma1.it'; //ARCA_WEBSITE

const initialState = {
    watermarkSvg: ontodiaLogoSvg,
    watermarkUrl: ONTODIA_WEBSITE,
    // criteria: {},
    


}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ('UPDATECRITERIA'):
            return {
                ...state, criteria: action.criteria
            };
            case('LANGUAGECHANGE'):
            return{
               ...state, language:action.currentEvent
            };
            case('SETCURRENTIRI'):
            return{
             ...state, currentIri: action.currentIri
            };
            case('SETCURRENTLABEL'):
            return{
             ...state, currentLabel: action.currentLabel
            };
        default:
            return state;
    }

};
export default reducer;