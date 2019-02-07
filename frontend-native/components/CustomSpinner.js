import React from 'react';
import { Text, Container, Content, Spinner } from 'native-base';

export default class CustomSpinner extends React.Component {

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
