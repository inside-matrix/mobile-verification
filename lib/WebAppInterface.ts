export interface WebAppInterface {
	OTPSent: (response: string) => void;
	OTPVerified: (response: string, number: string) => void;
	OTPSendFailed: (error: string) => void;
	OTPVerificationFailed: (error: string) => void;
	appDidBecomeActive: () => void;
}

export interface AnandApp {
	sendOTP: (number: string, msg: string, senderId: string) => void;
	verifyOTP: (otp: string) => void;
	initialize: (forVerification: boolean) => void;
	showSnack: (message: string) => void;
}

declare global {
	interface Window {
		AllModules: {
			app: WebAppInterface;
		};
		AnandApp: AnandApp;
	}
}
