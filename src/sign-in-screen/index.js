import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Hub } from 'aws-amplify';
import {
    TextInput,
    Button,
    useTheme
} from 'react-native-paper';
import {
    Appbar,
    AppbarBackAction,
    AppbarContent
} from '@codexporer.io/expo-appbar';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthenticationState } from '@codexporer.io/expo-amplify-auth';
import {
    useMessageDialogActions,
    MESSAGE_DIALOG_TYPE
} from '@codexporer.io/expo-message-dialog';
import trim from 'lodash/trim';
import { useScreenEvents } from '../screen-events';
import {
    Root,
    KeyboardAvoiding,
    SafeArea,
    Spacer,
    Scroll,
    TextLabel,
    LinkContainer,
    LinkText
} from './styled';

const SignInWithGoogleIcon = () => {
    const theme = useTheme();

    return (
        <FontAwesome name='google' size={24} color={theme.colors.primary} />
    );
};

const SignInWithAppleIcon = () => {
    const theme = useTheme();

    return (
        <FontAwesome name='apple' size={24} color={theme.colors.primary} />
    );
};

export const SignInScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const [
        {
            isAuthenticated
        },
        {
            signInWithGoogle,
            signInWithApple,
            signInWithUsername
        }
    ] = useAuthenticationState();
    const [, { open, close }] = useMessageDialogActions();
    const [, { show, hide }] = useLoadingDialogActions();
    const [isAuthenticationStarted, setIsAuthenticationStarted] = useState(false);
    const [currentAppState, setCurrentAppState] = useState();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignInDisabled, setIsSignInDisabled] = useState(true);
    const {
        onSignInScreenDisplay,
        onSignInWithUsernameStart,
        onSignInWithUsernameSuccess,
        onSignInWithUsernameError,
        onSignInWithGoogle: onSignInWithGoogleEvent,
        onSignInWithApple: onSignInWithAppleEvent
    } = useScreenEvents();
    const isFocused = useIsFocused();
    const hasBackAction = !!route.params?.signInHasBackAction;

    // When screen is focused
    const screenDisplayDependenciesRef = useRef();
    screenDisplayDependenciesRef.current = { onSignInScreenDisplay };
    useEffect(() => {
        const { onSignInScreenDisplay } = screenDisplayDependenciesRef.current;
        if (isFocused) {
            onSignInScreenDisplay();
        }
    }, [isFocused]);

    // Monitor if authentication has started
    useEffect(() => {
        const onAuthListener = data => {
            setIsAuthenticationStarted(data?.payload?.event === 'codeFlow');
        };

        Hub.listen('auth', onAuthListener);

        return () => {
            Hub.remove('auth', onAuthListener);
        };
    }, []);

    // Set app state (workaround to detect when browser authentication window is closed)
    useEffect(() => {
        const onAppStateChange = nextAppState => {
            setCurrentAppState(nextAppState);
        };

        AppState.addEventListener('change', onAppStateChange);

        return () => {
            AppState.removeEventListener('change', onAppStateChange);
        };
    }, [setCurrentAppState]);

    // Hide loading if authentication has been cancelled by the user
    useEffect(() => {
        if (currentAppState === 'active' && !isAuthenticated && !isAuthenticationStarted) {
            hide();
            setCurrentAppState();
        }
    }, [currentAppState, hide, isAuthenticated, isAuthenticationStarted]);

    // Hide loading if authentication is complete
    useEffect(() => {
        isAuthenticated && hide();
    }, [isAuthenticated, hide]);

    // Enable sign in button when both username and password fields are filled
    useEffect(() => {
        setIsSignInDisabled(!username || !password);
    }, [username, password]);

    const showAuthenticatingDialog = () => {
        show({ message: 'Signing in...' });
    };

    const onVerifyButtonPressed = async () => {
        navigation.navigate(
            'VerifyEmail',
            {
                email: username,
                signInHasBackAction: hasBackAction
            });
        close();
    };

    const onSignInWithUsername = async () => {
        onSignInWithUsernameStart();
        setIsSignInDisabled(true);
        try {
            showAuthenticatingDialog();
            await signInWithUsername({
                username: trim(username),
                password
            });
            onSignInWithUsernameSuccess();
        } catch (error) {
            onSignInWithUsernameError(error);
            hide();
            let message = 'An unknown error occurred. Check input fields or try again later.';
            const actions = [
                {
                    id: 'closeButton',
                    handler: close,
                    text: 'Close'
                }
            ];

            if (error.code === 'UserNotFoundException' || error.code === 'NotAuthorizedException') {
                message = 'Incorrect username or password.';
            }

            if (error.code === 'UserNotConfirmedException') {
                message = 'Your email address is not verified. Verify email to continue.';
                actions.push({
                    id: 'verifyButton',
                    handler: onVerifyButtonPressed,
                    text: 'Verify'
                });
            }

            open({
                title: 'Sign In Failed',
                message,
                type: MESSAGE_DIALOG_TYPE.error,
                actions
            });
            setIsSignInDisabled(!(username && password));
        }
    };

    const onSignInWithGoogle = () => {
        signInWithGoogle();
        showAuthenticatingDialog();
        onSignInWithGoogleEvent();
    };

    const onSignInWithApple = () => {
        signInWithApple();
        showAuthenticatingDialog();
        onSignInWithAppleEvent();
    };

    const onOpenSignUpScreen = () => navigation.navigate(
        'SignUp',
        { signInHasBackAction: hasBackAction }
    );

    const onOpenForgotPasswordScreen = () => navigation.navigate(
        'ForgotPassword',
        { signInHasBackAction: hasBackAction }
    );

    return (
        <Root>
            <Appbar>
                {hasBackAction && (
                    <AppbarBackAction
                        onPress={() => navigation.goBack()}
                    />
                )}
                <AppbarContent
                    title='Sign In'
                />
            </Appbar>
            <KeyboardAvoiding>
                <SafeArea>
                    <Scroll>
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='Email'
                            value={username}
                            onChangeText={setUsername}
                        />
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='Password'
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Spacer />
                        <Button
                            mode='contained'
                            disabled={isSignInDisabled}
                            onPress={onSignInWithUsername}
                        >
                            sign in
                        </Button>
                        <LinkContainer>
                            <TouchableOpacity
                                onPress={onOpenForgotPasswordScreen}
                                activeOpacity={0.5}
                            >
                                <LinkText color={theme.colors.primary}>Forgot Password</LinkText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onOpenSignUpScreen}
                                activeOpacity={0.5}
                            >
                                <LinkText color={theme.colors.primary}>Sign Up</LinkText>
                            </TouchableOpacity>
                        </LinkContainer>
                        <Spacer />
                        <Spacer />
                        <TextLabel>OR</TextLabel>
                        <Spacer />
                        <Spacer />
                        <Button
                            mode='outlined'
                            onPress={onSignInWithGoogle}
                            icon={SignInWithGoogleIcon}
                        >
                            Continue with Google
                        </Button>
                        <Spacer />
                        <Button
                            mode='outlined'
                            onPress={onSignInWithApple}
                            icon={SignInWithAppleIcon}
                        >
                            Continue with Apple
                        </Button>
                    </Scroll>
                </SafeArea>
            </KeyboardAvoiding>
        </Root>
    );
};
