import React, { useState, useEffect, useRef } from 'react';
import {
    TextInput,
    Button,
    useTheme
} from 'react-native-paper';
import { Hub } from 'aws-amplify';
import { useIsFocused } from '@react-navigation/native';
import {
    Appbar,
    AppbarBackAction,
    AppbarContent
} from '@codexporer.io/expo-appbar';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthenticationState } from '@codexporer.io/expo-amplify-auth';
import {
    useMessageDialogActions,
    MESSAGE_DIALOG_TYPE
} from '@codexporer.io/expo-message-dialog';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';
import { useAppState } from '@codexporer.io/expo-app-state';
import trim from 'lodash/trim';
import { useScreenEvents } from '../screen-events';
import {
    Root,
    KeyboardAvoiding,
    SafeArea,
    Spacer,
    Scroll,
    TextLabel,
    TextInputError
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

export const SignUpScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const [, { open, close }] = useMessageDialogActions();
    const [, { show, hide }] = useLoadingDialogActions();
    const [isAuthenticationStarted, setIsAuthenticationStarted] = useState(false);
    const appState = useAppState({ shouldListen: true });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [isPasswordError, setIsPasswordError] = useState(false);
    const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);
    const [
        {
            isAuthenticated
        },
        {
            signInWithGoogle,
            signInWithApple,
            signUpWithUsername
        }
    ] = useAuthenticationState();

    const [isDisabledSignUp, setIsDisabledSignUp] = useState(true);

    const {
        onSignUpScreenDisplay,
        onSignUpWithUsernameStart,
        onSignUpWithUsernameSuccess,
        onSignUpWithUsernameError,
        onSignUpWithGoogle: onSignUpWithGoogleEvent,
        onSignUpWithApple: onSignUpWithAppleEvent
    } = useScreenEvents();
    const isFocused = useIsFocused();

    // When screen is focused
    const screenDisplayDependenciesRef = useRef();
    screenDisplayDependenciesRef.current = { onSignUpScreenDisplay };
    useEffect(() => {
        const { onSignUpScreenDisplay } = screenDisplayDependenciesRef.current;
        if (isFocused) {
            onSignUpScreenDisplay();
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

    // Hide loading if authentication has been cancelled by the user
    useEffect(() => {
        if (appState.isActive === 'active' && !isAuthenticated && !isAuthenticationStarted) {
            hide();
        }
    }, [appState.isActive, hide, isAuthenticated, isAuthenticationStarted]);

    // Hide loading if authentication is complete
    useEffect(() => {
        isAuthenticated && hide();
    }, [isAuthenticated, hide]);

    useEffect(() => {
        setIsDisabledSignUp(!(username && password && confirmedPassword) ||
            isPasswordError ||
            isConfirmPasswordError);
    }, [username, password, confirmedPassword, isPasswordError, isConfirmPasswordError]);

    useEffect(() => {
        setIsPasswordError(password.length > 0 && password.length < 8);
        setIsConfirmPasswordError(confirmedPassword.length > 0 && confirmedPassword !== password);
    }, [password, confirmedPassword]);

    const showAuthenticatingDialog = () => {
        show({ message: 'Signing up...' });
    };

    const onSignUp = async () => {
        onSignUpWithUsernameStart();
        setIsDisabledSignUp(true);
        showAuthenticatingDialog();
        try {
            await signUpWithUsername({
                username: trim(username),
                password
            });
            hide();
            onSignUpWithUsernameSuccess();
            navigation.navigate(
                'VerifyEmail',
                {
                    email: username,
                    signInHasBackAction: route.params?.signInHasBackAction
                }
            );
        } catch (error) {
            hide();
            onSignUpWithUsernameError(error);
            open({
                title: 'Sign Up Failed',
                message: 'An unknown error occurred. Check input fields or try again later.',
                type: MESSAGE_DIALOG_TYPE.error,
                actions: [
                    {
                        id: 'okButton',
                        handler: close,
                        text: 'Ok'
                    }
                ]
            });
            setIsDisabledSignUp(false);
        }
    };

    const onSignUpWithGoogle = () => {
        showAuthenticatingDialog();
        signInWithGoogle();
        onSignUpWithGoogleEvent();
    };

    const onSignUpWithApple = () => {
        showAuthenticatingDialog();
        signInWithApple();
        onSignUpWithAppleEvent();
    };

    return (
        <Root>
            <Appbar>
                <AppbarBackAction
                    onPress={() => navigation.goBack()}
                />
                <AppbarContent
                    title='Sign Up'
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
                            error={isPasswordError}
                        />
                        {
                            isPasswordError && (
                                <TextInputError color={theme.colors.error}>
                                    Password must be at least 8 characters
                                </TextInputError>
                            )
                        }
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='Confirm Password'
                            secureTextEntry
                            value={confirmedPassword}
                            onChangeText={setConfirmedPassword}
                            autoCapitalize='none'
                            autoCorrect={false}
                            error={isConfirmPasswordError}
                        />
                        {
                            isConfirmPasswordError && (
                                <TextInputError color={theme.colors.error}>
                                    Passwords do not match
                                </TextInputError>
                            )
                        }
                        <Spacer />
                        <Button
                            onPress={onSignUp}
                            mode='contained'
                            disabled={isDisabledSignUp}
                        >
                            sign up
                        </Button>
                        <Spacer />
                        <Spacer />
                        <TextLabel>OR</TextLabel>
                        <Spacer />
                        <Spacer />
                        <Button
                            mode='outlined'
                            onPress={onSignUpWithGoogle}
                            icon={SignInWithGoogleIcon}
                        >
                            Continue with Google
                        </Button>
                        <Spacer />
                        <Button
                            mode='outlined'
                            onPress={onSignUpWithApple}
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
