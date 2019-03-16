import React from 'react';

import { connect } from 'react-redux';

import {types} from '../common-logic/redux-store.js';

import { Image } from 'react-native';
import { Container, Button, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Body, Icon } from 'native-base';

import config from '../common-logic/config.js';
import {nvl} from '../common-logic/generic_library.js';

import {getUTCTimeAsString} from '../common-logic/generic_library.js';
import BackgroundTaskRunner from './BackgroundTaskRunner.js';

const cards = [
	{
		text: 'Your Application Comes Here!',
		name: 'This is the [YourApplication.js] file.',
		image: require('../images/Car.gif'),
	 },
  ];

const colors = [
	"#C0C0C0",
	"#808080",
	"#FF0000",
	"#800000",
	"#808000",
	"#00FF00",
	"#00FFFF",
	"#FF00FF",
	"#800080",
];

function mapDispatchToProps(dispatch) {
	return({
		makered: () => {dispatch({type: types.HOMESCREENRED})},
		makeblue: () => {dispatch({type: types.HOMESCREENBLUE})},
		setAppState: (p_new_active_component) => {dispatch({
			type: types.LOGINNAV,
			activeLoginComponent: p_new_active_component
		})},
	})
};

function mapStateToProps(state) {
	return({
		JWT: state.JWT,
		homeScreenColorFromUp: state.homeScreenColor,
	});
};

class YourApplication extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			colorIndex: 0
		};
		this.testButtonPressed = this.testButtonPressed.bind(this);
	};

	componentDidMount(){
		let l_intervalPointer = setInterval(() => {
			l_index = (this.state.colorIndex + 1) % colors.length;
			this.setState({colorIndex: l_index})
		}, 1000);
		this.setState({intervalPointer: l_intervalPointer});
	}

	componentWillUnmount(){
		clearInterval(this.state.intervalPointer);
	}

	testButtonPressed(event){
		let l_btr = <BackgroundTaskRunner 
			key={"BTR_" + getUTCTimeAsString()}
			method={"POST"}
			uri={config.mainServerBaseURL + "/test"}
			body={{a: 1, b: 2, dummy: "value", dangerous_characters: "\"'`@<>[}{[\n\t"}}
			extra_header={{Authorization: 'Bearer ' + nvl(this.props.JWT, "xx")}}
		/>
		this.setState({backgroundtestrunner: l_btr});
	}	
	render() {
		let l_bgcolor = colors[this.state.colorIndex];
		return <Container>
			<View style={{backgroundColor: l_bgcolor }}>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<DeckSwiper
					dataSource={cards}
					renderItem={item =>
						<Card style={{ elevation: 3 }}>
							<CardItem>
								<Left>
									<Thumbnail source={item.image} />
									<Body>
										<Text>{item.text}</Text>
										<Text note>You can directly wire your application here.</Text>
									</Body>
								</Left>
							</CardItem>
							<CardItem cardBody>
								<Image style={{ height: 300, flex: 1 }} source={item.image} />
							</CardItem>
							<CardItem>
								<Icon name="heart" style={{ color: '#ED4A6A' }} />
								<Text>{item.name}</Text>
							</CardItem>
						</Card>
					}
				/>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Button info onPress={this.testButtonPressed} >
					<Text> Generic Test Button </Text>
				</Button>
			</View>
			{this.state.backgroundtestrunner}
		</Container>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(YourApplication);
