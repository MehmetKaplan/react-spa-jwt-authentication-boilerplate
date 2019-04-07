const debugMode_ = true;

import testApi from './api-ip.js';

export default  {
	debugMode: debugMode_,
	mainServerBaseURL: debugMode_ 
						? testApi.testServerBaseURL // eslint-disable-line no-useless-concat
						: "HERE COMES PRODUCTION API URL",

	JWTKey: "JWTKey",
	rememberMeKey: "RememberMe",
	FacebookAppID: "312680782763024",
	//GoogleClientIdWeb: '251867410582-ljs4f27nkb4gh3bvov1nmktce1ldri10.apps.googleusercontent.com',
	GoogleClientIdIOS: "251867410582-kuducdo0d01cpd6iirm0b6fdsud7affh.apps.googleusercontent.com",
	GoogleClientIdAndroid: "251867410582-o4kblifgn470pfbh549velp0rlna69dl.apps.googleusercontent.com",
	uiTexts: {
		Common: {
			back: "Back",
			submit: "Submit",
			yes: "Yes",
			no: "No",
			bye: "Bye",
		},
		NavigatorScreen: {
			logout: "Logout",
			yourapp1: "Your Application 1",
			yourapp2: "Your Application 2",
			settings: "Settings",
			app_title: "App Title Comes Here",
		},
		ChangeEmail: {
			newEMail: "New EMail",
			sendConfirmationCode: "Send Confirmation Code",
		},
		ChangePassword: {
			newPassword: "New Password",
			newPassword2: "Repeat New Password",
			oldPassword: "Old Password",
			changePassword: "Change Password",
		},
		ChangeEmailConfirm: {
			confirmationCode: "Confirmation Code",
		},
		UpdateData: {
			confirmationCode: "Confirmation Code",
			name: "Name",
			midname: "Midname",
			surname: "Surname",
			gender_id: "Gender",
			birthday: "Birthday",
			phone: "Phone",
			genders: {
				male: "male",
				female: "female",
				other: "other",
			},
		},
		Settings: {
			updateData: "Update your data",
			changePwd: "Change Password",
			changeEmail: "Change EMail",
			logout: "Logout",
		},
		SettingsScreen: {
			title: "Settings",
		},
		Login: {
			email: "EMail",
			password: "Password",
			login: "Login",
			forgotPassword: "Forgot Password",
			signUp: "Sign Up",
			rememberMe: "Don't Ask Password Next Time",
			FacebookLogin: "Login with Facebook",
			GoogleLogin: "Login with Google",
		},
		Logout: {
			logout: "Are you sure to log out?",
		},
		PasswordResetEMail: {
			sendConfirmation: "Send Confirmation",
			email: "EMail",
		},
		PasswordResetNewPassword: {
			resetPassword: "Reset Password",
			confirmationCode: "Confirmation Code",
			newPassword: "New Password",
			newPassword2: "Repeat New Password",
		},
		SignUpEmailConfirmation: {
			sendConfirmation: "Send Confirmation",
			email: "EMail",
		},
		SignUpRelatedInputs: {
			confirmationCode: "Confirmation Code",
			password: "Password",
			password2: "Repeat Password",
			name: "Name",
			midname: "Midname",
			surname: "Surname",
			gender_id: "Gender",
			birthday: "Birthday",
			phone: "Phone",
			genders: {
				male: "male",
				female: "female",
				other: "other",
			},
		}
	},
	signalsFrontendBackend: {
		socialSites:							{
			facebook: "FB",
			google: "google",
		},
	},
}
