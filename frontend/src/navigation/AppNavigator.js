import React from 'react';
//import PropTypes from 'prop-types';

import { createMuiTheme } from '@material-ui/core/styles';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';

import {nvl} from '../common-logic/generic_library.js';
import config from '../common-logic/config.js';

import HomeScreen from '../screens/HomeScreen.js';
import SettingsScreen from '../screens/SettingsScreen.js';

export default class ContainerContents extends React.Component {
	constructor(props) {
	super(props);
		// Here we may modify for multi language support
		this.state = {
			logout_title: config.uiTexts.NavigatorScreen.logout,
			yourapp1_title: config.uiTexts.NavigatorScreen.yourapp1,
			yourapp2_title: config.uiTexts.NavigatorScreen.yourapp2,
			settings_title: config.uiTexts.NavigatorScreen.settings,
			app_title: config.uiTexts.NavigatorScreen.app_title,
			anchorElRightMenu: null,
			anchorElLeftMenu: null,
			activeScreen: "HomeScreen",
		};

		this.theme=createMuiTheme({
			palette: {
				type: 'light'
			},
		});
		this.direct_link_flag = false;

		this.fillStyleConstants();

		this.onPressSettings = this.onPressSettings.bind(this);
		this.onPressYourApp1 = this.onPressYourApp1.bind(this);
		this.onPressYourApp2 = this.onPressYourApp2.bind(this);

		this.handleClickRightMenu = this.handleClickRightMenu.bind(this);
		this.handleCloseRightMenu = this.handleCloseRightMenu.bind(this); 
		this.handleClickLeftMenu = this.handleClickLeftMenu.bind(this);
		this.handleCloseLeftMenu = this.handleCloseLeftMenu.bind(this);
	
	}

	static get propTypes() { 
		return { 
		}; 
	}

	onPressSettings(event) {
		this.handleCloseLeftMenu();
		this.handleCloseRightMenu();
		//ReactDOM.render(, document.getElementById("content"));
		this.setState({activeScreen: "SettingsScreen"});
		event.preventDefault();
	}

	onPressYourApp1(event) {
		this.handleCloseLeftMenu();
		this.handleCloseRightMenu();
		this.setState({activeScreen: "HomeScreen"});
		if (nvl(event, "x") !== "x"){
			event.preventDefault();
		}
	}

	onPressYourApp2(event) {
		this.handleCloseLeftMenu();
		this.handleCloseRightMenu();
		//ReactDOM.render(, document.getElementById("content"));
		if (nvl(event, "x") !== "x"){
			event.preventDefault();
		}
	}

	componentDidMount(){
	}


	handleClickRightMenu (event) {
		this.setState({ anchorElRightMenu: event.currentTarget });
	};

	handleCloseRightMenu () {
		this.setState({ anchorElRightMenu: null });
	};

	handleClickLeftMenu(event) {
		this.setState({ anchorElLeftMenu: event.currentTarget });
	};

	handleCloseLeftMenu(){
		this.setState({ anchorElLeftMenu: null });
	};

	render() {
		/* Here is the differentiation between HomeScreen and SettingsScreen */
		/* Which was done at expo's navigation structure for native application */
		let l_active_screen;
		switch (this.state.activeScreen){
			case "HomeScreen":
				l_active_screen = <HomeScreen />;
				break;
			case "SettingsScreen":
				l_active_screen = <SettingsScreen />;
				break;
			default:
				l_active_screen = <HomeScreen />
				break;
		}

		return (
			<div>
				<AppBar position="fixed">
					<Toolbar>
						<Grid container spacing={8}>
							<Grid item xs={1}>
								<IconButton
									aria-owns={this.state.anchorElLeftMenu ? "menu-appbar-left" : null}
									aria-haspopup="true"
									onClick={this.handleClickLeftMenu}
									color="inherit"
								>
									<ViewHeadlineIcon />
								</IconButton>
								<Menu
									id="menu-appbar-left"
									anchorEl={this.state.anchorElLeftMenu}
									open={Boolean(this.state.anchorElLeftMenu)}
									onClose={this.handleCloseLeftMenu}
								>
									<Divider />
									<MenuItem onClick={(e) => {this.onPressYourApp1(e)}}>
										<ListItemIcon><ViewStreamIcon /></ListItemIcon>
										<ListItemText inset primary={this.state.yourapp1_title} />
									</MenuItem>
									<Divider />
									<MenuItem onClick={(e) => {this.onPressYourApp2(e)}}>
										<ListItemIcon><ViewStreamIcon /></ListItemIcon>
										<ListItemText inset primary={this.state.yourapp2_title} />
									</MenuItem>
								</Menu>
							</Grid>
							<Grid item xs={10} >
								<div align="center">
										{this.state.app_title}
								</div>
							</Grid>
							<Grid item xs={1}>
								<IconButton
									aria-owns={this.state.anchorElRightMenu ? "menu-appbar-right" : null}
									aria-haspopup="true"
									onClick={this.handleClickRightMenu}
									color="inherit"
								>
									<SettingsApplicationsIcon />
								</IconButton>
								<Menu
									id="menu-appbar-right"
									anchorEl={this.state.anchorElRightMenu}
									open={Boolean(this.state.anchorElRightMenu)}
									onClose={this.handleCloseRightMenu}
								>
									<MenuItem onClick={(e) => {this.onPressSettings(e)}}>
										<ListItemIcon><SettingsApplicationsIcon /></ListItemIcon>
										<ListItemText inset primary={this.state.settings_title} />
									</MenuItem>
									<Divider />
								</Menu>
							</Grid>
						</Grid>
					</Toolbar>
				</AppBar>
				<div id="placeholder" name="placeholder" style={{height:"64px" }} />
				<div style={{display:'flex', justifyContent: 'center'}}> {l_active_screen} </div>
			</div>
		);
	}

	fillStyleConstants(){
		// Style related
		this.stylesConstants = {
			c_icon_size: 40,
			c_icon_border_size: 1,
			c_open_nav_radius: 80,
			c_zigzag_delay: 200,
			c_icons_original_coordinate: {left: 0, top: 20}
		}
	}

}


