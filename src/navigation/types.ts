import type { NavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { UserSummary } from '../lib/types';

export type AuthStackParams = {
    Login: undefined;
    Register: undefined;
};

export type MainTabParams = {
    Home: undefined;
    Send: { recipient?: UserSummary } | undefined;
    History: undefined;
    Profile: undefined;
};

export type RootStackParams = {
    Tabs: NavigatorScreenParams<MainTabParams>;
    Beneficiaries: undefined;
    Cards: undefined;
    Security: undefined;
    Settings: undefined;
    EditProfile: undefined;
    Notifications: undefined;
};

export type RootNav = NavigationProp<RootStackParams>;
