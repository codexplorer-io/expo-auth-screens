import { createStore, createStateHook, createActionsHook } from 'react-sweet-state';
import without from 'lodash/without';
import forEach from 'lodash/forEach';

const Store = createStore({
    initialState: {
        subscribers: []
    },
    actions: {
        subscribe: subscriber => ({ getState, setState }) => {
            const { subscribers } = getState();
            setState({
                subscribers: [
                    ...subscribers,
                    subscriber
                ]
            });
        },
        unsubscribe: subscriber => ({ getState, setState }) => {
            const { subscribers } = getState();
            setState({
                subscribers: without(subscribers, subscriber)
            });
        }
    },
    name: 'ScreenEventsSubscribers'
});

const useAuthenticationEventsSubscriberState = createStateHook(Store);

const useAuthenticationEventsSubscriberActions = createActionsHook(Store, {
    selector: null
});

export const useScreenEvents = () => {
    const { subscribers } = useAuthenticationEventsSubscriberState();

    const onSignInScreenDisplay = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignInScreenDisplay?.();
        });
    };

    const onSignInWithUsernameStart = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignInWithUsernameStart?.();
        });
    };

    const onSignInWithUsernameSuccess = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignInWithUsernameSuccess?.();
        });
    };

    const onSignInWithUsernameError = error => {
        forEach(subscribers, subscriber => {
            subscriber.onSignInWithUsernameError?.(error);
        });
    };

    const onSignInWithGoogle = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignInWithGoogle?.();
        });
    };

    const onSignInWithApple = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignInWithApple?.();
        });
    };

    const onForgotPasswordScreenDisplay = () => {
        forEach(subscribers, subscriber => {
            subscriber.onForgotPasswordScreenDisplay?.();
        });
    };

    const onForgotPasswordSendCodeStart = () => {
        forEach(subscribers, subscriber => {
            subscriber.onForgotPasswordSendCodeStart?.();
        });
    };

    const onForgotPasswordSendCodeSuccess = () => {
        forEach(subscribers, subscriber => {
            subscriber.onForgotPasswordSendCodeSuccess?.();
        });
    };

    const onForgotPasswordSendCodeError = error => {
        forEach(subscribers, subscriber => {
            subscriber.onForgotPasswordSendCodeError?.(error);
        });
    };

    const onForgotPasswordResetStart = () => {
        forEach(subscribers, subscriber => {
            subscriber.onForgotPasswordResetStart?.();
        });
    };

    const onForgotPasswordResetSuccess = () => {
        forEach(subscribers, subscriber => {
            subscriber.onForgotPasswordResetSuccess?.();
        });
    };

    const onForgotPasswordResetError = error => {
        forEach(subscribers, subscriber => {
            subscriber.onForgotPasswordResetError?.(error);
        });
    };

    const onSignUpScreenDisplay = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignUpScreenDisplay?.();
        });
    };

    const onSignUpWithUsernameStart = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignUpWithUsernameStart?.();
        });
    };

    const onSignUpWithUsernameSuccess = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignUpWithUsernameSuccess?.();
        });
    };

    const onSignUpWithUsernameError = error => {
        forEach(subscribers, subscriber => {
            subscriber.onSignUpWithUsernameError?.(error);
        });
    };

    const onSignUpWithGoogle = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignUpWithGoogle?.();
        });
    };

    const onSignUpWithApple = () => {
        forEach(subscribers, subscriber => {
            subscriber.onSignUpWithApple?.();
        });
    };

    const onVerifyEmailScreenDisplay = () => {
        forEach(subscribers, subscriber => {
            subscriber.onVerifyEmailScreenDisplay?.();
        });
    };

    const onVerifyEmailStart = () => {
        forEach(subscribers, subscriber => {
            subscriber.onVerifyEmailStart?.();
        });
    };

    const onVerifyEmailSuccess = () => {
        forEach(subscribers, subscriber => {
            subscriber.onVerifyEmailSuccess?.();
        });
    };

    const onVerifyEmailError = error => {
        forEach(subscribers, subscriber => {
            subscriber.onVerifyEmailError?.(error);
        });
    };

    const onVerifyEmailSendCodeStart = () => {
        forEach(subscribers, subscriber => {
            subscriber.onVerifyEmailSendCodeStart?.();
        });
    };

    const onVerifyEmailSendCodeSuccess = () => {
        forEach(subscribers, subscriber => {
            subscriber.onVerifyEmailSendCodeSuccess?.();
        });
    };

    const onVerifyEmailSendCodeError = error => {
        forEach(subscribers, subscriber => {
            subscriber.onVerifyEmailSendCodeError?.(error);
        });
    };

    return {
        onSignInScreenDisplay,
        onSignInWithUsernameStart,
        onSignInWithUsernameSuccess,
        onSignInWithUsernameError,
        onSignInWithGoogle,
        onSignInWithApple,
        onForgotPasswordScreenDisplay,
        onForgotPasswordSendCodeStart,
        onForgotPasswordSendCodeSuccess,
        onForgotPasswordSendCodeError,
        onForgotPasswordResetStart,
        onForgotPasswordResetSuccess,
        onForgotPasswordResetError,
        onSignUpScreenDisplay,
        onSignUpWithUsernameStart,
        onSignUpWithUsernameSuccess,
        onSignUpWithUsernameError,
        onSignUpWithGoogle,
        onSignUpWithApple,
        onVerifyEmailScreenDisplay,
        onVerifyEmailStart,
        onVerifyEmailSuccess,
        onVerifyEmailError,
        onVerifyEmailSendCodeStart,
        onVerifyEmailSendCodeSuccess,
        onVerifyEmailSendCodeError
    };
};

export const useSubscribeOnScreenEvents =
    () => useAuthenticationEventsSubscriberActions().subscribe;

export const useUnsubscribeFromScreenEvents =
    () => useAuthenticationEventsSubscriberActions().unsubscribe;
