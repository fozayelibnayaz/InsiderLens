import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Params that can be passed when navigating between the three screens.
export type RootStackParamList = {
  Home: undefined;
  // Home can tell the Screener to focus the search input right away.
  Screener: { focusSearch?: boolean } | undefined;
  TradeDetails: { tradeId: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type ScreenerScreenProps = NativeStackScreenProps<RootStackParamList, 'Screener'>;
export type TradeDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TradeDetails'
>;