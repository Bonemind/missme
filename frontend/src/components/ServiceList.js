import React, { Component } from 'react';
import { Col, ListGroup, ListGroupItem, Badge, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import apiClient from '../apiClient';

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
		// Healthy == true means the service has checked in recently, or isn't over the miss threshold yet
		// Healthy == false means the service has missed enough checkins to go over the threshold
		// Healthy == null | undefined means the service has never checked in yet
		return (
			<ListGroupItem key={service.ServiceId}>
				<Link to={`/service/${service.ServiceId}/edit`}>{service.name}</Link>
				{ service.isHealthy === true &&
						<Badge className="float-right" color="success">Ok</Badge> }
				{ service.isHealthy === false &&
						<Badge className="float-right" color="danger">Dead</Badge> }
				{ service.isHealthy == null &&
						<Badge className="float-right" color="secondary">Unknown</Badge> }
			</ListGroupItem>
		);
	}

	render() {
		if (this.state.services == null) {
			return (<b>Loading</b>);
		}
		const { history } = this.props;
		return (
			<Col md={12}>
				<h2>Services</h2>
				<ListGroup flush>
					{ this.state.services.map(this.renderServiceEntry) }
				</ListGroup>
				<Button type="submit" onClick={() => history.push('/service/create')}>Add service</Button>
			</Col>
		);
	}
};
