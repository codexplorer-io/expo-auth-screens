import React, { useState, useEffect, useRef } from 'react';
import {
    TextInput,
    Button,
    Text,
    useTheme
} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import {
    Appbar,
    AppbarBackAction,
    AppbarContent
} from '@codexporer.io/expo-appbar';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';
import { useMessageDialogActions, MESSAGE_DIALOG_TYPE } from '@codexporer.io/expo-message-dialog';
import { useAppSnackbarActions, APP_SNACKBAR_POSITION } from '@codexporer.io/expo-app-snackbar';
import { useAuthenticationStateActions } from '@codexporer.io/expo-amplify-auth';
import trim from 'lodash/trim';
import { useScreenEvents } from '../screen-events';
import {
    Root,
    KeyboardAvoiding,
    SafeArea,
    Spacer,
    Scroll,
    TextInputError
} from './styled';

export const ForgotPasswordScreen = ({ navigation, route }) => {
    const theme = useTheme();

    const {
        forgotPasswordWithUsername,
        forgotPasswordSubmitWithUsername
    } = useAuthenticationStateActions();
    const { open, close } = useMessageDialogActions();
    const [, { show, hide }] = useLoadingDialogActions();
    const [, { show: showAppSnackbar }] = useAppSnackbarActions();

    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const [isSendCodeDisabled, setIsSendCodeDisabled] = useState(false);
    const [isResetDisabled, setIsResetDisabled] = useState(true);
    const [isPasswordError, setIsPasswordError] = useState(false);
    const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);

    const {
        onForgotPasswordScreenDisplay,
        onForgotPasswordSendCodeStart,
        onForgotPasswordSendCodeSuccess,
        onForgotPasswordSendCodeError,
        onForgotPasswordResetStart,
        onForgotPasswordResetSuccess,
        onForgotPasswordResetError
    } = useScreenEvents();
    const isFocused = useIsFocused();

    // When screen is focused
    const screenDisplayDependenciesRef = useRef();
    screenDisplayDependenciesRef.current = { onForgotPasswordScreenDisplay };
    useEffect(() => {
        const { onForgotPasswordScreenDisplay } = screenDisplayDependenciesRef.current;
        if (isFocused) {
            onForgotPasswordScreenDisplay();
        }
    }, [isFocused]);

    useEffect(() => {
        setIsSendCodeDisabled(!username);
    }, [username]);

    useEffect(() => {
        setIsResetDisabled(!(username && code && password && confirmedPassword) ||
            isPasswordError ||
            isConfirmPasswordError);
    }, [username, code, password, confirmedPassword, isPasswordError, isConfirmPasswordError]);

    useEffect(() => {
        setIsPasswordError(password.length > 0 && password.length < 8);
        setIsConfirmPasswordError(confirmedPassword.length > 0 && confirmedPassword !== password);
    }, [password, confirmedPassword]);

    const onSendCodePressed = async () => {
        onForgotPasswordSendCodeStart();
        setIsSendCodeDisabled(true);
        show({ message: 'Sending...' });
        try {
            await forgotPasswordWithUsername({
                username: trim(username)
            });
            hide();
            onForgotPasswordSendCodeSuccess();
            setCode('');
            showAppSnackbar({
                message: `Verification code has been sent to ${username}. Use the code to reset your password.`,
                duration: 5000,
                position: APP_SNACKBAR_POSITION.top
            });
        } catch (error) {
            hide();
            onForgotPasswordSendCodeError(error);
            open({
                title: 'Send Code Failed',
                message: 'Check input fields or try again later.',
                type: MESSAGE_DIALOG_TYPE.error,
                actions: [
                    {
                        id: 'okButtonSendCodeFailed',
                        handler: close,
                        text: 'Ok'
                    }
                ]
            });
        } finally {
            setIsSendCodeDisabled(false);
        }
    };

    const onResetPasswordPressed = async () => {
        onForgotPasswordResetStart();
        setIsResetDisabled(true);
        show({ message: 'Resetting...' });
        try {
            await forgotPasswordSubmitWithUsername({
                username: trim(username),
                code,
                password
            });
            hide();
            onForgotPasswordResetSuccess();
            showAppSnackbar({
                message: 'Your password has been reset successfully.',
                duration: 5000,
                position: APP_SNACKBAR_POSITION.top
            });
            navigation.push(
                'SignIn',
                { signInHasBackAction: route.params?.signInHasBackAction }
            );
        } catch (error) {
            hide();
            onForgotPasswordResetError(error);
            open({
                title: 'Reset Password Failed',
                message: 'Resend code or try again later.',
                type: MESSAGE_DIALOG_TYPE.error,
                actions: [
                    {
                        id: 'okButtonResetFailed',
                        handler: close,
                        text: 'Ok'
                    }
                ]
            });
            setIsResetDisabled(false);
        }
    };

    return (
        <Root>
            <Appbar>
                <AppbarBackAction
                    onPress={() => navigation.goBack()}
                />
                <AppbarContent
                    title='Forgot Password'
                />
            </Appbar>
            <KeyboardAvoiding hasScroll>
                <SafeArea edges={['right', 'bottom', 'left']}>
                    <Scroll>
                        <Spacer />
                        <Text>
                            Enter the email associated with your account and
                            we will send you a code to reset your password.
                        </Text>
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='Email'
                            value={username}
                            onChangeText={setUsername}
                        />
                        <Spacer />
                        <Button
                            mode='contained'
                            disabled={isSendCodeDisabled}
                            onPress={onSendCodePressed}
                        >
                            Send code
                        </Button>
                        <Spacer />
                        <Spacer />
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='Code'
                            value={code}
                            onChangeText={setCode}
                        />
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='New Password'
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
                            mode='contained'
                            disabled={isResetDisabled}
                            onPress={onResetPasswordPressed}
                        >
                            Reset password
                        </Button>
                    </Scroll>
                </SafeArea>
            </KeyboardAvoiding>
        </Root>
    );
};
