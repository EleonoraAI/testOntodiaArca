const ONTODIA_WEBSITE = 'http://arca.diag.uniroma1.it/'; //ARCA_WEBSITEontodia-logo.svg
const ONTODIA_LOGO_SVG = require('../../../testOntodiaArca/node_modules/arca-ontodia/images/ontodia-logo.svg');
const initialState = {
    watermarkSvg: ONTODIA_LOGO_SVG,
    watermarkUrl: ONTODIA_WEBSITE,
    criteria:{}

}
const reducer = (state = initialState, action)=>{
    if(action.type ==='UPDATECRITERIA'){
        return{criteria: action.payload

        }
    }
    return state;
};
export default reducer;
