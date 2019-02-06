import React from 'react';
import { Text, Container, Header, Content, Spinner } from 'native-base';

export default class CheckLoginScreen extends React.Component {

	constructor() {
		super();
	}

	render() {
		return <Container>
			<Content>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Spinner />
			</Content>
		</Container>;
	}
}
