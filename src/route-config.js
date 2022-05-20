import { TransitionPresets } from '@react-navigation/stack';
import { SignInScreen } from './sign-in-screen';
import { SignUpScreen } from './sign-up-screen';
import { ForgotPasswordScreen } from './forgot-password-screen';
import { VerifyEmailScreen } from './verify-email-screen';

export const getRouteConfig = () => [
    {
        name: 'SignIn',
        screen: SignInScreen,
        screenOptions: {
            ...TransitionPresets.SlideFromRightIOS
        }
    },
    {
        name: 'SignUp',
        screen: SignUpScreen,
        screenOptions: {
            ...TransitionPresets.SlideFromRightIOS
        }
    },
    {
        name: 'ForgotPassword',
        screen: ForgotPasswordScreen,
        screenOptions: {
            ...TransitionPresets.SlideFromRightIOS
        }
    },
    {
        name: 'VerifyEmail',
        screen: VerifyEmailScreen,
        screenOptions: {
            ...TransitionPresets.SlideFromRightIOS
        }
    }
];
