const ONTODIA_WEBSITE = 'http://arca.diag.uniroma1.it/'; //ARCA_WEBSITEontodia-logo.svg
const ONTODIA_LOGO_SVG ='test';
const initialState = {
    watermarkSvg: ONTODIA_LOGO_SVG,
    watermarkUrl: ONTODIA_WEBSITE,
    criteria:{},
   

}
const reducer = (state = initialState, action)=>{
    switch(action.type){
        case('UPDATECRITERIA'):
        return {...state, criteria: action.criteria};
        default:return state;
    }
    
};
export default reducer;
