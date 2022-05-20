import styled from 'styled-components/native';
import { KeyboardAvoidingView } from '@codexporer.io/expo-keyboard-avoiding-view';

export const Root = styled.View`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: ${({ theme: { colors: { background } } }) => background};
`;

export const KeyboardAvoiding = styled(KeyboardAvoidingView)`
    flex: 1;
`;

export const SafeArea = styled.SafeAreaView`
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

export const TextInputError = styled.Text`
    color: ${({ color }) => color};
`;
