import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
	progress: {
	  margin: theme.spacing.unit * 2,
	},
 });
 
class CustomSpinner extends React.Component {
	render() {
		return <Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justify="center"
			style={{ minHeight: '100vh' }}
		>
			<Grid item xs={3}>
				<CircularProgress className={this.props.progress} />
			</Grid>
		</Grid>;
		}
}

export default withStyles(styles)(CustomSpinner);