# expo-auth-screens
Authentication workflow screens for expo/react-native. Currently supports only amplify (cognito) authentication through <a href="https://github.com/codexplorer-io/expo-amplify-auth" target="_blank">expo-amplify-auth</a>.

## Platform Compatibility
iOS|Android|Web|
-|-|-|
✅|✅|❌|

## Samples

<img title="Sign In" src="https://github.com/codexplorer-io/expo-auth-screens/blob/main/samples/signin.png?raw=true" width="40%"> <img title="Sign Up" src="https://github.com/codexplorer-io/expo-auth-screens/blob/main/samples/signup.png?raw=true" width="40%">
<img title="Reset Password" src="https://github.com/codexplorer-io/expo-auth-screens/blob/main/samples/forgot-password.png?raw=true" width="40%"> <img title="Verify Email" src="https://github.com/codexplorer-io/expo-auth-screens/blob/main/samples/verify-email.png?raw=true" width="40%">

## Prerequisites
Module requires a few module dependencies (look at `peerDependencies` within `package.json`) and some theme variable initalizations before it can be used and components redered properly.

Required theme variables:

- **colors.error** - Error color used to highlight an error
- **colors.background** - Background color used as the screen background
- **colors.primary** - Theme primary color

```javascript
import { ThemeProvider } from 'styled-components';
import { Provider as PaperProvider } from 'react-native-paper';
import { App } from './app';

const theme = {
    colors: {
        error: errorColor,
        background: backgroundColor,
        primary: primaryColor,
        ...
    },
    ...
};

export const AppThemeWrapper = () => (
    <ThemeProvider theme={theme}>
        <PaperProvider theme={theme}>
            <App />
        </PaperProvider>
    </ThemeProvider>
);
```

As a requirement to display the screens, they need to be integrated with react native navigation:
```javascript
import { getRouteConfig } from '@codexporer.io/expo-auth-screens';
import { NavigationContainer } from '@react-navigation/native';
...

const Stack = createSharedElementStackNavigator();
const { Navigator, Screen } = Stack;
const routeConfig = getRouteConfig();
...

<NavigationContainer>
    <Navigator>
        {routeConfig.map(
            ({ name, screen, screenOptions }) => (
              <Screen
                key={name}
                name={name}
                component={screen}
                options={screenOptions}
                ...rest props
              />
            )
        )}
        ...other screens
    </Navigator>
</NavigationContainer>
```

## Usage

Depending on current auth state within the app, route to correct screen. Eg. if user is authenticated, allow them to use the app, otherwise, route to `Sign In` screen:
```javascript
import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import includes from 'lodash/includes';
import { useAuthenticationState } from '@codexporer.io/expo-amplify-auth';

const Stack = createSharedElementStackNavigator();

const { Navigator } = Stack;

const authFlowScreens = ['SignIn'];

export const AppScreensContainer = () => {
    const navigationRef = useRef();
    const currentNavigationRef = navigationRef.current;
    const [{ isAuthenticated }] = useAuthenticationState();

    useEffect(() => {
        if (!currentNavigationRef) {
            return;
        }

        const currentRouteName = currentNavigationRef.getCurrentRoute().name;
        const isOnAuthFlowScreen = includes(authFlowScreens, currentRouteName);

        if (isAuthenticated && isOnAuthFlowScreen) {
            currentNavigationRef.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            });
        }

        if (!isAuthenticated && !isOnAuthFlowScreen) {
            currentNavigationRef.reset({
                index: 0,
                routes: [{ name: 'SignIn' }]
            });
        }
    }, [currentNavigationRef, isAuthenticated]);

    return (
        <NavigationContainer
            ref={navigationRef}
        >
            <Navigator
                initialRouteName={isAuthenticated ? 'Home' : 'SignIn'}
                screenOptions={{ headerShown: false }}
            >
                ...screens
            </Navigator>
        </NavigationContainer>
    );
};
```

Module also allows to subscribe on events that can be used to trigger in app actions:
```javascript
import React, { useEffect } from 'react';
import {
    useSubscribeOnScreenEvents,
    useUnsubscribeFromScreenEvents
} from '@codexporer.io/expo-auth-screens';

const useSubscribeAuthScreenEvents = () => {
    const subscribe = useSubscribeOnScreenEvents();
    const unsubscribe = useUnsubscribeFromScreenEvents();

    useEffect(() => {
        const subscriber = {
            onSignInScreenDisplay: () => {
                console.log('---> onSignInScreenDisplay');
            },
            onSignInWithUsernameStart: () => {
                console.log('---> onSignInWithUsernameStart');
            },
            onSignInWithUsernameSuccess: () => {
                console.log('---> onSignInWithUsernameSuccess');
            },
            onSignInWithUsernameError: error => {
                console.log('---> onSignInWithUsernameError');
                console.error(error);
            },
            onSignInWithGoogle: () => {
                console.log('---> onSignInWithGoogle');
            },
            onSignInWithApple: () => {
                console.log('---> onSignInWithApple');
            },
            onForgotPasswordScreenDisplay: () => {
                console.log('---> onForgotPasswordScreenDisplay');
            },
            onForgotPasswordSendCodeStart: () => {
                console.log('---> onForgotPasswordSendCodeStart');
            },
            onForgotPasswordSendCodeSuccess: () => {
                console.log('---> onForgotPasswordSendCodeSuccess');
            },
            onForgotPasswordSendCodeError: error => {
                console.log('---> onForgotPasswordSendCodeError');
                console.error(error);
            },
            onForgotPasswordResetStart: () => {
                console.log('---> onForgotPasswordResetStart');
            },
            onForgotPasswordResetSuccess: () => {
                console.log('---> onForgotPasswordResetSuccess');
            },
            onForgotPasswordResetError: error => {
                console.log('---> onForgotPasswordResetError');
                console.error(error);
            },
            onSignUpScreenDisplay: () => {
                console.log('---> onSignUpScreenDisplay');
            },
            onSignUpWithUsernameStart: () => {
                console.log('---> onSignUpWithUsernameStart');
            },
            onSignUpWithUsernameSuccess: () => {
                console.log('---> onSignUpWithUsernameSuccess');
            },
            onSignUpWithUsernameError: error => {
                console.log('---> onSignUpWithUsernameError');
                console.error(error);
            },
            onSignUpWithGoogle: () => {
                console.log('---> onSignUpWithGoogle');
            },
            onSignUpWithApple: () => {
                console.log('---> onSignUpWithApple');
            },
            onVerifyEmailScreenDisplay: () => {
                console.log('---> onVerifyEmailScreenDisplay');
            },
            onVerifyEmailStart: () => {
                console.log('---> onVerifyEmailStart');
            },
            onVerifyEmailSuccess: () => {
                console.log('---> onVerifyEmailSuccess');
            },
            onVerifyEmailError: error => {
                console.log('---> onVerifyEmailError');
                console.error(error);
            },
            onVerifyEmailSendCodeStart: () => {
                console.log('---> onVerifyEmailSendCodeStart');
            },
            onVerifyEmailSendCodeSuccess: () => {
                console.log('---> onVerifyEmailSendCodeSuccess');
            },
            onVerifyEmailSendCodeError: error => {
                console.log('---> onVerifyEmailSendCodeError');
                console.error(error);
            }
        };

        subscribe(subscriber);

        return () => {
            unsubscribe(subscriber);
        };
    }, [
        subscribe,
        unsubscribe
    ]);
};

export const App = () => {
    useSubscribeAuthScreenEvents();

    return ...;
};
```

## Exports
symbol|description|
-|-|
getRouteConfig|config for configuring react-navigation screens|
useSubscribeOnScreenEvents|hook used to subscribe on screen events|
useUnsubscribeFromScreenEvents|hook used to unsubscribe from screen events|

## getRouteConfig
Returns an array with with screen configurations used to configure react-navigation navigator screens.

## useSubscribeOnScreenEvents
Returns the action used to subscribe on events triggered by auth screens.

## useUnsubscribeFromScreenEvents
Returns the action used to unsubscribe from events triggered by auth screens.
