import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from 'reactstrap';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import awsmobile from './aws-exports';
import ServiceForm from './components/ServiceForm';
import ServiceList from './components/ServiceList';


Amplify.configure(awsmobile);

function App() {
	return (
		<Router>
			<Container>
				<Route path="/" exact component={ServiceList} />
				<Route path="/service/create" component={ServiceForm} />
				<Route path="/service/:serviceId/edit" component={ServiceForm} />
			</Container>
		</Router>
	);
}

export default withAuthenticator(App, true);
