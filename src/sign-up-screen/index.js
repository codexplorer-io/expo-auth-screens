import React, { useState, useEffect, useRef } from 'react';
import {
    TextInput,
    Button,
    useTheme
} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import {
    Appbar,
    AppbarBackAction,
    AppbarContent
} from '@codexporer.io/expo-appbar';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthenticationStateActions } from '@codexporer.io/expo-amplify-auth';
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

export const SignUpScreen = ({ navigation }) => {
    const theme = useTheme();
    const [, {
        signInWithGoogle,
        signInWithApple,
        signUpWithUsername
    }] = useAuthenticationStateActions();
    const [, { open, close }] = useMessageDialogActions();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [isPasswordError, setIsPasswordError] = useState(false);
    const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);

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

    useEffect(() => {
        setIsDisabledSignUp(!(username && password && confirmedPassword) ||
            isPasswordError ||
            isConfirmPasswordError);
    }, [username, password, confirmedPassword, isPasswordError, isConfirmPasswordError]);

    useEffect(() => {
        setIsPasswordError(password.length > 0 && password.length < 8);
        setIsConfirmPasswordError(confirmedPassword.length > 0 && confirmedPassword !== password);
    }, [password, confirmedPassword]);

    const onSignUp = async () => {
        onSignUpWithUsernameStart();
        setIsDisabledSignUp(true);
        try {
            await signUpWithUsername({
                username: trim(username),
                password
            });
            onSignUpWithUsernameSuccess();
            navigation.navigate('VerifyEmail', { email: username });
        } catch (error) {
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
        signInWithGoogle();
        onSignUpWithGoogleEvent();
    };

    const onSignUpWithApple = () => {
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
                        />
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='Password'
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
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
