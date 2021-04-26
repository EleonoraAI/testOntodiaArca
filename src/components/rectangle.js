import React,{Component} from 'react';
import TitleRectangle from './TitleRectangle';
import {
	connect
} from 'react-redux';

import '../styles/rectangle.css';



 class Rectangle extends Component {
    

    render() { 
        
        return (  
            <div className="Rectangle">
				< TitleRectangle text={this.props.criteria ? this.props.criteria.text: ''}/>
				<p> <span>halo iri: </span> { this.props.target ? this.props.target.iri : ''}</p>
				<p> <span>halo label: </span> {this.props.target ? JSON.stringify(this.props.target._data.label.values.filter( (key)=> 
						key.datatype==='http://www.w3.org/2001/XMLSchema#string' ?
						key.text:''
						)):''}</p>
				
			</div>
        );
		
    }


}
const mapStateToProps = state => {
	return {
		watermarkSvg: state.watermarkSvg,
		watermarkUrl: state.watermarkUrl,
		criteria: state.criteria,
		target: state.target,
		
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSearchCriteriaChanged: (value) => dispatch({
			type: 'UPDATECRITERIA',
			criteria: value
		}),
	
	
	};

};
export  default  connect(mapStateToProps, mapDispatchToProps, null, {
	forwardRef: true
})(Rectangle)






