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
				<h5> Parola ricercata: {this.props.criteria.text}</h5>
				<p> halo iri : { this.props.currentIri}</p>
		 </div>
        );

    }


}
const mapStateToProps = state => {
	return {
		watermarkSvg: state.watermarkSvg,
		watermarkUrl: state.watermarkUrl,
		criteria: state.criteria,
	    language: state.language,
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
		onLanguageChange: (e) => {
			dispatch({
				type: 'LANGUAGECHANGE',
				currentEvent: `${e}`
			});
		},
		
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






