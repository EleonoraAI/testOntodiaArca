import ontodiaLogoSvg from '../../src/ontodia-logo.svg';
const ONTODIA_WEBSITE = 'http://arca.diag.uniroma1.it'; //ARCA_WEBSITE

const initialState = {
    watermarkSvg: ontodiaLogoSvg,
    watermarkUrl: ONTODIA_WEBSITE,
    language: 'it',
    
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
            case('TAKETARGET'):
            return{
             ...state, target:action.target
            };
            
            
        default:
            return state;
    }

};
export default reducer;