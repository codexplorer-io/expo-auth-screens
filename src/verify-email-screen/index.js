import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    TextInput,
    Text
} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import {
    Appbar,
    AppbarBackAction,
    AppbarContent
} from '@codexporer.io/expo-appbar';
import { useMessageDialogActions, MESSAGE_DIALOG_TYPE } from '@codexporer.io/expo-message-dialog';
import { useAppSnackbarActions, APP_SNACKBAR_POSITION } from '@codexporer.io/expo-app-snackbar';
import { useAuthenticationStateActions } from '@codexporer.io/expo-amplify-auth';
import trim from 'lodash/trim';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';
import { useScreenEvents } from '../screen-events';
import {
    Root,
    KeyboardAvoiding,
    SafeArea,
    Spacer,
    Scroll
} from './styled';

export const VerifyEmailScreen = ({ navigation, route }) => {
    const email = route.params?.email;

    const [, {
        confirmSignUpWithUsername,
        resendSignUpWithUsername
    }] = useAuthenticationStateActions();
    const { open, close } = useMessageDialogActions();
    const [, { show, hide }] = useLoadingDialogActions();
    const [, { show: showAppSnackbar }] = useAppSnackbarActions();

    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [isVerifyDisabled, setIsVerifyDisabled] = useState(false);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    const {
        onVerifyEmailScreenDisplay,
        onVerifyEmailStart,
        onVerifyEmailSuccess,
        onVerifyEmailError,
        onVerifyEmailSendCodeStart,
        onVerifyEmailSendCodeSuccess,
        onVerifyEmailSendCodeError
    } = useScreenEvents();
    const isFocused = useIsFocused();

    // When screen is focused
    const screenDisplayDependenciesRef = useRef();
    screenDisplayDependenciesRef.current = { onVerifyEmailScreenDisplay };
    useEffect(() => {
        const { onVerifyEmailScreenDisplay } = screenDisplayDependenciesRef.current;
        if (isFocused) {
            onVerifyEmailScreenDisplay();
        }
    }, [isFocused]);

    useEffect(() => {
        setUsername(email);
    }, [email]);

    useEffect(() => {
        setIsResendDisabled(!username);
    }, [username]);

    useEffect(() => {
        setIsVerifyDisabled(!(username && code));
    }, [username, code]);

    const onVerifyButtonPressed = async () => {
        onVerifyEmailStart();
        setIsVerifyDisabled(true);
        show({ message: 'Verifying...' });
        try {
            await confirmSignUpWithUsername({
                username: trim(username),
                code
            });
            hide();
            onVerifyEmailSuccess();
            showAppSnackbar({
                message: 'Your email has been verified successfully.',
                duration: 5000,
                position: APP_SNACKBAR_POSITION.top
            });
            navigation.push(
                'SignIn',
                { signInHasBackAction: route.params?.signInHasBackAction }
            );
        } catch (error) {
            hide();
            onVerifyEmailError(error);
            open({
                title: 'Verification Failed',
                message: 'Resend code or try again later.',
                type: MESSAGE_DIALOG_TYPE.error,
                actions: [
                    {
                        id: 'okButtonVerifyFailed',
                        handler: close,
                        text: 'Ok'
                    }
                ]
            });
            setIsVerifyDisabled(false);
        }
    };

    const onResendButtonPressed = async () => {
        onVerifyEmailSendCodeStart();
        setIsResendDisabled(true);
        show({ message: 'Sending...' });
        try {
            await resendSignUpWithUsername({
                username: trim(username)
            });
            hide();
            onVerifyEmailSendCodeSuccess();
            setCode('');
            showAppSnackbar({
                message: `Verification code has been sent to ${username}. Use the code to verify your email.`,
                duration: 5000,
                position: APP_SNACKBAR_POSITION.top
            });
        } catch (error) {
            hide();
            onVerifyEmailSendCodeError(error);
            open({
                title: 'Resend Code Failed',
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
            setIsResendDisabled(false);
        }
    };

    return (
        <Root>
            <Appbar>
                <AppbarBackAction
                    onPress={() => navigation.goBack()}
                />
                <AppbarContent
                    title='Verify Email'
                />
            </Appbar>
            <KeyboardAvoiding hasScroll>
                <SafeArea edges={['right', 'bottom', 'left']}>
                    <Scroll>
                        <Spacer />
                        <Text>
                            Enter the verification code we sent to your email address or resend code
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
                            disabled={isResendDisabled}
                            onPress={onResendButtonPressed}
                        >
                            Resend Code
                        </Button>
                        <Spacer />
                        <TextInput
                            mode='outlined'
                            label='Code'
                            value={code}
                            onChangeText={setCode}
                        />
                        <Spacer />
                        <Button
                            mode='contained'
                            disabled={isVerifyDisabled}
                            onPress={onVerifyButtonPressed}
                        >
                            Verify
                        </Button>
                    </Scroll>
                </SafeArea>
            </KeyboardAvoiding>
        </Root>
    );
};
