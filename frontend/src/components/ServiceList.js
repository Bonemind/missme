import React, { Component } from 'react';
import { Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import apiClient from '../apiClient';

const validIntervalUnits = new Map();
validIntervalUnits.set('H', 'Hours');
validIntervalUnits.set('D', 'Days');
validIntervalUnits.set('W', 'Weeks');
validIntervalUnits.set('M', 'Months');
validIntervalUnits.set('Y', 'Years');

export default class ServiceList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			services: null
		};
	}

	async load() {
		const result = await apiClient.get('/services');
		this.setState({  services: result.Items });
	}

	componentDidMount() {
		this.load();
	}

	renderServiceEntry(service) {
		return (
			<ListGroupItem key={service.ServiceId}>
				<Link to={`/service/${service.ServiceId}/edit`}>{service.name}</Link>
			</ListGroupItem>
		);
	}

	render() {
		if (this.state.services == null) {
			return (<b>Loading</b>);
		}
		return (
			<Col md={12}>
				<ListGroup>
					{ this.state.services.map(this.renderServiceEntry) }
				</ListGroup>
			</Col>
		);
	}
};
