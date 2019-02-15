import React from 'react';

import { connect } from 'react-redux';

import { types } from '../common-logic/redux-store.js';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';


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
	return ({
		makered: () => { dispatch({ type: types.HOMESCREENRED }) },
		makeblue: () => { dispatch({ type: types.HOMESCREENBLUE }) },
		setAppState: (p_new_active_component) => {
			dispatch({
				type: types.LOGINNAV,
				activeLoginComponent: p_new_active_component
			})
		},
	})
};

function mapStateToProps(state) {
	return ({
		homeScreenColorFromUp: state.homeScreenColor,
		hostMachine: state.hostMachine,
	});
};

const styles = theme => ({
	card: {
		maxWidth: 400,
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	actions: {
		display: 'flex',
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	avatar: {
		backgroundColor: red[500],
	},
});

class YourApplication extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			colorIndex: 0,
			expanded: false,
		};
	};

	componentDidMount(){
		let l_intervalPointer = setInterval(() => {
			let l_index = (this.state.colorIndex + 1) % colors.length;
			this.setState({colorIndex: l_index})
		}, 1000);
		this.setState({intervalPointer: l_intervalPointer});
	}

	componentWillUnmount(){
		clearInterval(this.state.intervalPointer);
	}

	handleExpandClick = () => {
		this.setState(state => ({ expanded: !state.expanded }));
	};

	render() {
		const { classes } = this.props;
		let l_bgcolor = colors[this.state.colorIndex];

		return (
			<Card className={classes.card} style={{ backgroundColor: l_bgcolor }}>
				<CardHeader
					avatar={
						<Avatar aria-label="Avatar" className={classes.avatar}>
							<img src={cards[0].image} alt=""/>
						</Avatar>
					}
					action={
						<IconButton>
							<MoreVertIcon />
						</IconButton>
					}
					title={cards[0].name}
					subheader=""
				/>
				<CardMedia
					className={classes.media}
					image={cards[0].image}
					title={cards[0].name}
				/>
				<CardContent>
						{cards[0].text}
				</CardContent>
				<CardActions className={classes.actions} disableActionSpacing>
					<IconButton aria-label="Add to favorites">
						<FavoriteIcon />
					</IconButton>
					<IconButton aria-label="Share">
						<ShareIcon />
					</IconButton>
					<IconButton
						className={classnames(classes.expand, {
							[classes.expandOpen]: this.state.expanded,
						})}
						onClick={this.handleExpandClick}
						aria-expanded={this.state.expanded}
						aria-label="Show more"
					>
						<ExpandMoreIcon />
					</IconButton>
				</CardActions>
				<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
					<CardContent>
						{cards[0].name}
						{cards[0].text}
						 You can directly wire your application here.
					</CardContent>
				</Collapse>
			</Card>
		);
	}
}

YourApplication.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(YourApplication));
