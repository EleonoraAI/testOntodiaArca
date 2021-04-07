import ontodiaLogoSvg from '../../node_modules/arca-ontodia/images/ontodia-logo.svg';
const ONTODIA_WEBSITE = 'http://arca.diag.uniroma1.it/'; //ARCA_WEBSITEontodia-logo.svg

const initialState = {
    watermarkSvg: ontodiaLogoSvg,
    watermarkUrl: ONTODIA_WEBSITE,
    criteria: {},


}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ('UPDATECRITERIA'):
            return {
                ...state, criteria: action.criteria
            };
        default:
            return state;
    }

};
export default reducer;