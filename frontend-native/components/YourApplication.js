import React from 'react';

import { connect } from 'react-redux';

import {types} from '../redux-store.js';

import { Image } from 'react-native';
import { Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Body, Icon } from 'native-base';

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
		homeScreenColorFromUp: state.homeScreenColor,
		hostMachine: state.hostMachine,
	});
};

class YourApplication extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			colorIndex: 0
		};
	};

	componentDidMount(){
		let l_intervalPointer = setInterval(() => {
			l_index = (this.state.colorIndex + 1) % colors.length;
			this.setState({colorIndex: l_index})
		}, 1000);
		this.setState({intervalPointer: l_intervalPointer});
		console.log(this.props.hostMachine);
	}

	componentWillUnmount(){
		clearInterval(this.state.intervalPointer);
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

			</View>
		</Container>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(YourApplication);
