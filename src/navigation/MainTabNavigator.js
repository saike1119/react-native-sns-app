import { Constants } from 'expo';
import { createStackNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
/* from app */
import HomeScreen from 'app/src/screens/HomeScreen';
import SearchScreen from 'app/src/screens/SearchScreen';
import NotificationScreen from 'app/src/screens/NotificationScreen';
import UserScreen from 'app/src/screens/UserScreen';
import {
  HomeTabIcon,
  SearchTabIcon,
  TakeTabIcon,
  NotificationTabIcon,
  MeTabIcon,
  TabBar,
} from 'app/src/components/Tab';

const createTabStack = (title, screen) =>
  createStackNavigator({
    [title]: { screen },
  });

export default createBottomTabNavigator(
  {
    HomeTabs: {
      screen: createTabStack('HomeTabs', HomeScreen),
      navigationOptions: () => ({
        tabBarIcon: SearchTabIcon,
      }),
    },
    TakeTab: {
      screen: () => null,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: TakeTabIcon,
        tabBarOnPress: () => {
          navigation.push('TakeModal');
        },
      }),
    },
    NotificationTab: {
      screen: createTabStack('NotificationTab', NotificationScreen),
      navigationOptions: () => ({
        tabBarIcon: NotificationTabIcon,
      }),
    },
    MeTab: {
      screen: createTabStack('MeTab', UserScreen),
      navigationOptions: () => ({
        tabBarIcon: MeTabIcon,
      }),
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: '#333',
      inactiveTintColor: '#bbb',
      style: {
        backgroundColor: Constants.manifest.extra.backgroundColor,
      },
    },
    tabBarComponent: TabBar,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
