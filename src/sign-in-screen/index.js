import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
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
import { useAppState } from '@codexporer.io/expo-app-state';
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
    const { open, close } = useMessageDialogActions();
    const [, { show, hide }] = useLoadingDialogActions();
    const appState = useAppState({ shouldListen: true });
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

    // Hide loading if authentication has been cancelled by the user
    useEffect(() => {
        if (appState.isActive && !isAuthenticated) {
            hide();
        }
    }, [appState.isActive, hide, isAuthenticated]);

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
        navigation.push(
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

    const onOpenSignUpScreen = () => navigation.push(
        'SignUp',
        { signInHasBackAction: hasBackAction }
    );

    const onOpenForgotPasswordScreen = () => navigation.push(
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
            <KeyboardAvoiding hasScroll>
                <SafeArea edges={['right', 'bottom', 'left']}>
                    <Scroll>
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='Email'
                            value={username}
                            onChangeText={setUsername}
                            textContentType='emailAddress'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='email'
                        />
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='Password'
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize='none'
                            autoCorrect={false}
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
