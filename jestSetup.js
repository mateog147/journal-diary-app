import { jest } from '@jest/globals';

// Mock the RNGestureHandlerModule
jest.mock('react-native-gesture-handler', () => {
  return {
    State: {},
    PanGestureHandler: 'PanGestureHandler',
    TapGestureHandler: 'TapGestureHandler',
  };
});

// Mock Animated
jest.mock(
  'react-native/Libraries/Animated/NativeAnimatedHelper',
  () => {
    return {
      shouldUseNativeDriver: () => false,
    };
  },
  { virtual: true },
);

// Mock the Alert component
jest.mock(
  'react-native/Libraries/Alert/Alert',
  () => ({
    alert: jest.fn(),
  }),
  { virtual: true },
);

// Setup for React Navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock for react-redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
}));

// Mock for react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'IconCommunity',
);

// Properly mock Alert.alert as a Jest mock function
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));


