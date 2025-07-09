import styled from 'styled-components/native';
import { KeyboardAvoidingView } from '@codexporer.io/expo-keyboard-avoiding-view';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Root = styled.View`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: ${({ theme: { colors: { background } } }) => background};
`;

export const KeyboardAvoiding = styled(KeyboardAvoidingView)`
    flex: 1;
`;

export const SafeArea = styled(SafeAreaView)`
    flex: 1;
`;

export const Spacer = styled.View`
    height: 10px;
`;

export const Scroll = styled.ScrollView`
    padding-left: 10px;
    padding-right: 10px;
`;

export const TextLabel = styled.Text`
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
`;

export const LinkContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    padding-left: 50px;
    padding-right: 50px;
`;

export const LinkText = styled.Text`
    color: ${({ color }) => color};
`;
