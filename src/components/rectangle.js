import React,{Component} from 'react';

import {
	connect
} from 'react-redux';

import '../styles/rectangle.css';



//  
 class Rectangle extends Component {
    

    render() { 
        
        return (  
            <div className="Rectangle">
				<h5><span>criteria: </span>{this.props.criteria ? this.props.criteria.text: 'no result'}</h5>
				<p> <span>current iri: </span> { this.props.currentIri  ? this.props.currentIri : 'no iri selected'}</p>
			</div>
        );
		
    }


}
const mapStateToProps = state => {
	return {
		watermarkSvg: state.watermarkSvg,
		watermarkUrl: state.watermarkUrl,
		criteria: state.criteria,
		currentIri: state.currentIri,
		currentLabel: state.currentLabel
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSearchCriteriaChanged: (value) => dispatch({
			type: 'UPDATECRITERIA',
			criteria: value
		}),
		
		
		onPointerDown: (element) => {
			if (
				element.target &&
				element.target.iri

			) {
				var label_text = element.target.data.label.values.filter(function (key) {
					if (key.datatype === "http://www.w3.org/2001/XMLSchema#string") {
						return (key.text)
					}
				});

				dispatch({
					type: 'SETCURRENTIRI',
					currentIri: element.target.iri
				});
				dispatch({
					type: 'SETCURRENTLABEL',
					currentLabel: label_text

				});
				

			}
		}

	};

};
export  default  connect(mapStateToProps, mapDispatchToProps, null, {
	forwardRef: true
})(Rectangle)






