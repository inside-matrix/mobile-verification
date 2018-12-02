import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { AnandApp, WebAppInterface } from './WebAppInterface';
import { Values } from './values';

export class MobileVerification implements WebAppInterface {
	private mobileField: MDCTextField;
	private otpField: MDCTextField;
	private sendOtpButton: HTMLElement;
	private mobileNo: string;

	public constructor() {
		let mobileTextField = document.querySelector('#send_otp_section .mdc-text-field.mobile');
		this.mobileField = new MDCTextField(mobileTextField);

		this.sendOtpButton = document.querySelector('#send_otp_section .mdc-button.button');
		let buttonRipple = new MDCRipple(this.sendOtpButton);
		this.sendOtpButton.addEventListener('click', this.onSendOTP.bind(this));

		let otpTextField = document.querySelector('#verify_otp_section .mdc-text-field.mobile');
		this.otpField = new MDCTextField(otpTextField);
		let verifyOtpButton = document.querySelector('#verify_otp_section .mdc-button.button');
		let verifyButtonField = new MDCRipple(verifyOtpButton);
		verifyOtpButton.addEventListener('click', this.onVerifyOTP.bind(this));
	}

	private onSendOTP() {
		this.sendOtpButton.removeEventListener('click', this.onSendOTP);
		this.sendOtpButton.className += ' disable';
		this.sendOtpButton.innerText = 'Sending OTP';

		let mobileInput = document.getElementById('sasapp_device_no') as HTMLInputElement;
		this.mobileNo = mobileInput.value;

		this.sendOTP(this.mobileNo);
	}

	private onVerifyOTP() {
		let otp = document.getElementById('sasapp_otp') as HTMLInputElement;
		let otpValue = otp.value;

		this.verifyOTP(otpValue);
	}

	private sendOTP(number: string): void {
		window.AnandApp.sendOTP(number, Values.OTP_MSG, Values.OTP_SENDER_ID);
	}

	private verifyOTP(otp: string): void {
		if (otp && otp.length === 6) {
			window.AnandApp.verifyOTP(otp);
		} else {
			this.showStatusMsg('Please enter 6 digit OTP sent on your mobile.', 'Error');
		}
	}

	private showStatusMsg(msg: string, type: 'Error' | 'Information' | 'Success') {
		window.AnandApp.showSnack(type + ': ' + msg);
	}

	public OTPSent(response: string): void {
		console.log(response);
		document.getElementById('send_otp_section').style.display = 'none';
		document.getElementById('verify_otp_section').style.display = 'block';
		document.getElementById('otp_sent_on').innerText += this.mobileNo;
	}

	public OTPVerified(response: string, number: string): void {
		console.log(response);
		localStorage.setItem(Values.VERIFIED_MOBILE_NO_KEY, number);
		window.location.replace('/');
	}

	public OTPSendFailed(error: string): void {
		console.log(error);

		this.sendOtpButton.addEventListener('click', this.onSendOTP.bind(this));
		this.sendOtpButton.className = 'foo-button mdc-button mdc-button--raised button';
		this.sendOtpButton.innerText = 'SEND OTP';
		this.showStatusMsg('OTP could not be sent. Please Try Again.', 'Error');
	}

	public OTPVerificationFailed(error: any): void {
		console.log(error);
		let message = error.message;
		if (message === 'last_otp_request_on_this_number_is_invalid') {
			this.showStatusMsg('OTP Request is Invalid. Please Start Again.', 'Error');
		} else if (message === 'otp_not_verified') {
			this.showStatusMsg('OTP Verifcation Failed. Please Try Again.', 'Error');
		} else {
			this.showStatusMsg('Error in OTP Verifcation. Please Try Again.', 'Error');
		}
	}

	public appDidBecomeActive(): void {}
}

let instance: MobileVerification = new MobileVerification();
window.AllModules = {
	app: instance
};
window.AnandApp.initialize(true);
