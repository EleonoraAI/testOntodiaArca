import * as React from 'react';

import {
	connect
} from 'react-redux';
import {
	State,
	state
} from 'venti';

import '../styles/graph.css';

var Ontodia = require('arca-ontodia');

function onWorkspaceMounted(workspace) {
	if (!workspace) {
		return;
	}


	const model = workspace.getModel();

	model.importLayout({

		diagram: Ontodia.makeSerializedDiagram({
			linkTypeOptions: [{
					"@type": "LinkTypeOptions",
					property: "http://dbpedia.org/ontology/wikiPageWikiLink",
					visible: false
				},
				{
					"@type": "LinkTypeOptions",
					property: "http://dbpedia.org/ontology/associate",
					visible: false
				},
				{
					"@type": "LinkTypeOptions",
					property: "http://www.w3.org/2000/01/rdf-schema#seeAlso",
					visible: false
				},
				{
					"@type": "LinkTypeOptions",
					property: "http://dbpedia.org/ontology/wikiPageEternalLink",
					visible: false
				}
			]
		}),
		validateLinks: true,

		dataProvider: new Ontodia.CompositeDataProvider(
			[
				new Ontodia.SparqlDataProvider({
					endpointUrl: '/sparql-endpoint',
					imagePropertyUris: [
						// "http://xmlns.com/foaf/0.1/depiction",
						'http://xmlns.com/foaf/0.1/img',
					],

				}, {
					...Ontodia.OWLStatsSettings,
					...{
						fullTextSearch: {
							prefix: 'PREFIX bds: <http://www.bigdata.com/rdf/search#>' + '\n' +
								'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>' + '\n',
							queryPattern: `
								
									?inst rdfs:label | skos:altLabel ?searchLabel.
									FILTER(NOT EXISTS { 
										?inst a <http://www.lerma.org/Snippet>
									}).

									FILTER(NOT EXISTS { 
										?inst a <http://www.free.org/Snippet>
									}).

									SERVICE bds:search {
											?searchLabel bds:search "\${text}*" ;
											bds:minRelevance '0' ;
											bds:matchAllTerms 'true';
											bds:relevance ?score;
											bds:rank ?rank .
									}
								
									`,
						},

						elementInfoQuery: `
									CONSTRUCT {
										?inst rdf:type ?class;
											rdfs:label ?label;
											?propType ?propValue.
									}
									WHERE {
										OPTIONAL {?inst rdf:type ?class . }
										OPTIONAL {?inst \${dataLabelProperty} ?label}
										OPTIONAL {?inst ?propType ?propValue.
										FILTER (isLiteral(?propValue)) }
										VALUES ?labelProp { rdfs:label foaf:name }
									} VALUES (?inst) {\${ids}}
							`,
					},
				}),

				new Ontodia.SparqlDataProvider({
						endpointUrl: '/dbpedia',
						imagePropertyUris: [
							'http://xmlns.com/foaf/0.1/depiction',
							'http://xmlns.com/foaf/0.1/img',
						],
						queryMethod: Ontodia.SparqlQueryMethod.GET,
					},
					Ontodia.DBPediaSettings, {
						...Ontodia.DBPediaSettings,
						...{
							fullTextSearch: {
								prefix: 'PREFIX dbo: <http://dbpedia.org/ontology/>\n',
								queryPattern: `
									?inst rdfs:label ?searchLabel. 
									?searchLabel bif:contains "\${text}".
									?inst dbo:wikiPageID ?origScore .
									BIND(0-?origScore as ?score)
								`,
							},

							// extractLabel: true,

							classTreeQuery: `
								SELECT distinct ?class ?label ?parent WHERE {
								?class rdfs:label ?label.
								OPTIONAL {?class rdfs:subClassOf ?parent}
								?root rdfs:subClassOf owl:Thing.
								?class rdfs:subClassOf? | rdfs:subClassOf/rdfs:subClassOf ?root
								}

							`,


							elementInfoQuery: `
								CONSTRUCT {
									?inst rdf:type ?class .
									?inst rdfs:label ?label .
									?inst ?propType ?propValue.
								} WHERE {
									VALUES (?inst) {\${ids}}
									?inst rdf:type ?class .
									?inst rdfs:label ?label .
									FILTER (lang(?propValue) = "" || langMatches(lang(?propValue), "IT")) .
									FILTER (!contains(str(?class), 'http://dbpedia.org/class/yago'))

									

									OPTIONAL {?inst ?propType ?propValue.
									FILTER (isLiteral(?propValue)) }
								}
								
							`,

							filterElementInfoPattern: `
								OPTIONAL {?inst rdf:type ?foundClass. FILTER (!contains(str(?foundClass), 'http://dbpedia.org/class/yago'))}
								BIND (coalesce(?foundClass, owl:Thing) as ?class)
								OPTIONAL {?inst \${dataLabelProperty} ?label}
							`,

							imageQueryPattern: ` { ?inst ?linkType ?fullImage } UNION { [] ?linkType ?inst. BIND(?inst as ?fullImage) }
									BIND(CONCAT("https://commons.wikimedia.org/w/thumb.php?f=",
									STRAFTER(STR(?fullImage), "Special:FilePath/"), "&w=200") AS ?image)
							`,
						},
					}
				),
			], {
				mergeMode: 'fetchAll'
			}

		),
	});
}

export default class OntodiaGraph extends React.Component {


	render() {

		const props = {

			onWorkspaceEvent: (e) => {
				if (e === 'search:queryItems') {
					try {
						const search = window.$r.state.criteria["text"]
						this.setState({
							currentEvent: `${e}: ${search}`
						});
						//call VENTI api
						state.set('ArcaEvent', {
							event: `${e}: ${search}`,
							timeStamp: new Date().toLocaleString(),
						})
						// console.log('TRY',search, window)
					} catch {
						const search = 'no_available'
						this.setState({
							currentEvent: `${e}: ${search}`
						});
						//call VENTI api
						state.set('ArcaEvent', {
							event: `${e}: ${search}`,
							timeStamp: new Date().toLocaleString(),
						})
						// console.log('CATCH', window)
					}
				} else {
					this.setState({
						currentEvent: `${e}`
					});
					//call VENTI api
					state.set('ArcaEvent', {
						event: e,
						timeStamp: new Date().toLocaleString(),
					})
				}
				if (e === 'editor:changeSelection') {
					// console.log(props)
				}

			},


			// onLanguageChange: (e) => {
			// 	this.setState({ currentEvent: `changeLang: ${e}`});
			// },

           

			onPointerDown: (element) => {
				if (
					element.target &&
					element.target.iri &&
					(!this.state ||
						(element.target.iri !== this.state.currentIri &&
							element.target.iri.indexOf('lerma.it') == -1))
				) {
					var label_text = element.target.data.label.values.filter(function (key) {
						if (key.datatype === "http://www.w3.org/2001/XMLSchema#string") {
							return (key.text)
						}
					});

					this.setState({
						currentIri: element.target.iri
					});
					this.setState({
						currentLabel: label_text
					});

					//call VENTI api
					state.set('SelectedElement', {
						currentIri: element.target.iri,
						type: 'concept',
						label: label_text,
					})
					// //console.log(element)


				} else if (
					element.target &&
					element.target.iri &&
					(!this.state ||
						(element.target.iri !== this.state.currentIri &&
							element.target.iri.indexOf('lerma.it') >= 1))
				) {
					// EXTRACT LABEL WITH datatype: http://www.w3.org/2001/XMLSchema#string
					var label_text = element.target.data.label.values.filter(function (key) {
						if (key.datatype === "http://www.w3.org/2001/XMLSchema#string") {
							return (key.text)
						}
					});
					//call VENTI api
					state.set('SelectedElement', {
						currentIri: element.target.iri,
						type: 'book',
						label: label_text,
					})
				}
			},
			leftPanelInitiallyOpen: true,
			ref: onWorkspaceMounted,


			languages: [{
					code: 'it',
					label: 'Italiano',
				},
				{
					code: 'en',
					label: 'English',
				},
				{
					code: 'de',
					label: 'Deutsch',
				},
				// {
				//     code: 'ru',
				//     label: 'Russo'
				// },
			],
			language: 'it',
			viewOptions: {
				onIriClick: ({
					iri
				}) => window.open(iri),
			},


			typeStyleResolver: (types) => {
				//BOOK
				if (types.indexOf('http://lerma.org/Book') !== -1) {
					return {
						color: '#80040a',
						// background: '#ffff3b',
						// icon: logo_lerma
					};
				}

				//SNIPPET
				else if (types.indexOf('http://www.lerma.org/Snippet') !== -1) {
					return {
						color: '#9fbe8a',
					};
				}

				// else if (types.indexOf('http://free.org/Book') !== -1) {
				// 	return {
				// 		color: '#80040a',
				// 		icon: logo_free_book,
				// 	};
				// }

				// else if (types.indexOf('http://www.free.org/Snippet') !== -1) {
				// 	return {
				// 		color: '#9fbe8a',
				// 		icon: logo_free_snippet,
				// 	};
				// }

				//CONCEPT
				else if (types.indexOf('http://lerma.org/Concept') !== -1) {
					return {
						color: '#00961c',
					};
				}

				// //CONCEPT AND FREE
				// else if (types.indexOf('http://lerma.org/Concept') !== -1 && types.indexOf('http://free.org/Concept') !== -1) {
				// 	return {
				// 		color: '#00961c',
				// 	};
				// }

				// //CONCEPT FREE
				// else if (types.indexOf('http://free.org/Concept') !== -1) {
				// 	return {
				// 		color: '#6370d0',
				// 	};
				// }


				//METADATA
				else if (
					types.indexOf('http://lerma.org/metadata/YearPublication') !== -1
				) {
					return {
						color: '#A9A9A9',
					};
				} else if (
					types.indexOf('http://lerma.org/metadata/Chronology') !== -1
				) {
					return {
						color: '#A9A9A9',
					};
				} else if (types.indexOf('http://lerma.org/metadata/Topic') !== -1) {
					return {
						color: '#A9A9A9',
					};
				} else if (types.indexOf('http://lerma.org/metadata/Typology') !== -1) {
					return {
						color: '#A9A9A9',
					};
				} else {
					return {
						color: '#046380',
					};
				}
			},

		};
        
		return ( <
			ConnectedOntodia {
				...props
			}
			/>
		);
	}

}
const mapStateToProps = state => {
	return {
		watermarkSvg: state.watermarkSvg,
		watermarkUrl: state.watermarkUrl,
		criteria: state.criteria,
		language: state.language,
        halo:state.currentIri



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
		onPointerDown: (element) => {if (
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
			// dispatch({
			// 	type: 'SETCURRENTLABEL',
			// 	currentLabel: label_text
			// });

			//call VENTI api
			state.set('SelectedElement', {
				currentIri: element.target.iri,
				type: 'concept',
				label: label_text,
			})
			// //console.log(element)


		}}

	};

};
export const ConnectedOntodia = connect(mapStateToProps, mapDispatchToProps, null, {
	forwardRef: true
})(Ontodia.Workspace)