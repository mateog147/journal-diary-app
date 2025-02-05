import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/HomeScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {EntryScreen} from '../screens/EntryScreen';
import {COLORS} from '../themes/constants/styles-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
          console.log('route :>> ', route);
          if (route.name === 'Main') {
            console.log('home :>> ');
            iconName = focused
              ? 'airplane'
              : 'alarm';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'rocket' : 'rocket';
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: COLORS.mainColor ?? '#1554f7',
          height: 54,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarLabelStyle: {
            fontSize: 16,
          },
        }}
      />
      <Tab.Screen
        name="Main"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: {
            fontSize: 16,
          },
        }}
      />

      <Tab.Screen
        name="Entry"
        component={EntryScreen}
        options={{
          tabBarLabel: 'Add Entry',
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="hand-holding-heart" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 16,
          },
        }}
      />
    </Tab.Navigator>
  );
};
