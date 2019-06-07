import React, { Component, Fragment } from 'react';
import { Input, FormGroup, Col, Label, Button, Row, Card, CardTitle, CardText, ListGroup, ListGroupItem } from 'reactstrap';
import confirmDialog from 'reactstrap-confirm';
import apiClient from '../apiClient';
import { validIntervalUnits } from '../constants';

class PropertyDisplay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			basePath: ''
		};
		apiClient.getBasePath().then((result) => {
			this.setState({basePath: result});
		});
	}

	render() {
		const { service } = this.props;
		return (
			<Fragment>
				<FormGroup>
					<Label for="serviceId">ID</Label>
					<Input type="text" disabled name="serviceId" id="serviceId" value={service.ServiceId} />
				</FormGroup>
				<FormGroup>
					<Label for="ApiKey">Api Key</Label>
					<Input type="text" disabled name="ApiKey" id="ApiKey" value={service.ApiKey} />
				</FormGroup>
				<Card body>
					<CardTitle>CURL example</CardTitle>
					<CardText>
						<code>
							curl -H "x-api-key: {service.ApiKey}" {this.state.basePath}/notify/{service.ServiceId}
						</code>
					</CardText>
				</Card>
				<br />
				<br />
			</Fragment>
		);
	}
}

class IntervalField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			unit: 'H',
			count: 1,
			...props.input
		};
	}

	static getDerivedStateFromProps(props, state) {
		/* eslint-disable eqeqeq */
		if (props.input.unit != state.prevPropsUnit || props.input.count != state.prevPropsCount) {
			return {
				prevPropsUnit: props.input.unit,
				prevPropsCount: props.input.count,
				...props.input
			};
		}
		/* eslint-enable eqeqeq */
		return null;
	}

	handleChange(field, value) {
		const { onChange } = this.props;
		this.setState({[field]: value}, () => {
			onChange({unit: this.state.unit, count: this.state.count});
		});
	}
	
	render() {
		return (
			<Row form>
				<Col md={6}>
					<FormGroup>
						<Label for="unit">Unit</Label>
						<Input
							id="unit"
							type="select"
							value={this.state.unit}
							onChange={e => this.handleChange('unit', e.target.value)}
						>
							{[...validIntervalUnits.keys()].map(u => <option key={u} value={u}>{validIntervalUnits.get(u)}</option>)}
						</Input>
					</FormGroup>
				</Col>
				<Col md={6}>
					<FormGroup>
						<Label for="count">Count</Label>
						<Input
							id="count"
							type="number"
							value={this.state.count}
							onChange={e => this.handleChange('count', Number(e.target.value))}
						/>
					</FormGroup>
				</Col>
			</Row>
		);
	}
};

export default class ServiceForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			interval: {
				unit: 'H',
				count: 1
			},
			threshold: 0
		};
	}

	updateField(field, value) {
		this.setState({[field]: value});
	}

	async save() {
		const { history } = this.props;

		try {
			if (this.state.ServiceId) {
				await apiClient.put(`/services/${this.state.ServiceId}`, { body: this.state });
			} else {
				await apiClient.post('/services', { body: this.state });
			}
		} catch (e) {
			console.error(e);
		}
		history.push('/');
	}

	async delete() {
		const confirmation = await confirmDialog();
		const { history } = this.props;

		if (!confirmation) {
			return;
		}

		try {
			if (this.state.ServiceId) {
				await apiClient.del(`/services/${this.state.ServiceId}`);
			}
		} catch (e) {
			console.error(e);
		}
		history.push('/');
	}

	componentDidMount() {
		const { match: { params } } = this.props;
		if (!params.serviceId) {
			return;
		}
		apiClient.get(`/services/${params.serviceId}`).then((data) => {
			this.setState(data);
		});
	}


	render() {
		const { history } = this.props;
		return (
			<Col md={12}>
				<h2>
					{this.state.ServiceId
						? `Service: ${this.state.name}` : 'Create Service'}
				</h2>
				{this.state.ServiceId && <PropertyDisplay service={this.state} />}
				<FormGroup>
					<Label for="name">Name</Label>
					<Input
						id="name"
						type="text"
						onChange={e => this.updateField('name', e.target.value)}
						value={this.state.name}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="description">Description</Label>
					<Input
						id="description"
						type="text"
						onChange={e => this.updateField('description', e.target.value)}
						value={this.state.description}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="interval">Interval</Label>
					<IntervalField
						input={this.state.interval}
						onChange={(value) => this.updateField('interval', value)}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="threshold">Treshold</Label>
					<Input
						id="threshold"
						type="number"
						onChange={e => this.updateField('threshold', Number(e.target.value))}
						value={this.state.threshold}
					/>
				</FormGroup>
				<Button type="submit" onClick={() => history.push('/')}>Back</Button>&nbsp;
				{ this.state.ServiceId && 
					<Button type="submit" color="danger" onClick={() => this.delete()}>Delete</Button>
				}&nbsp;
				<Button type="submit" color="primary" onClick={() => this.save()}>Save</Button>
				<br />
				<br />

				{ this.state.checkins && <h2>Recent checkins</h2> }

				<ListGroup>
					{ this.state.checkins && this.state.checkins.map(c => <ListGroupItem key={c}>{new Date(c).toLocaleString()}</ListGroupItem>) }
				</ListGroup>
			</Col>
		);
	}
};
