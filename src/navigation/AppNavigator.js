import { createStackNavigator, NavigationActions } from 'react-navigation';

/* screen */
import MainTabNavigator from 'src/navigation/MainTabNavigator';
import UserScreen from 'src/screens/UserScreen';
import TagScreen from 'src/screens/TagScreen';
import PostScreen from 'src/screens/PostScreen';
import TakeScreen from 'src/screens/TakeScreen';
import TakePublishScreen from 'src/screens/TakePublishScreen';

/* from app */
import IconButton from 'src/components/IconButton';

const TakeStack = createStackNavigator(
  {
    take: { screen: TakeScreen },
    takePublish: { screen: TakePublishScreen },
  },
  {
    headerMode: 'screen',
  }
);

const CardNavigator = createStackNavigator(
  {
    Main: { screen: MainTabNavigator, navigationOptions: { header: null } },
    User: { screen: UserScreen },
    Tag: { screen: TagScreen },
    Post: { screen: PostScreen },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        color: '#333',
      },
      headerLeft: IconButton,
    }),
  }
);

const AppNavigator = createStackNavigator(
  {
    MainStack: {
      screen: CardNavigator,
      navigationOptions: {
        header: null,
      },
    },
    TakeModal: {
      screen: TakeStack,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: () => ({
      headerTitleStyle: {
        color: '#333',
      },
    }),
  }
);

const navigateOnce = getStateForAction => (action, state) => {
  const { type, routeName } = action;
  if (state && type === NavigationActions.NAVIGATE) {
    if (routeName === state.routes[state.routes.length - 1].routeName) {
      return null;
    }
  }
  return getStateForAction(action, state);
};

export const getActiveRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
};

AppNavigator.router.getStateForAction = navigateOnce(
  AppNavigator.router.getStateForAction
);

export default AppNavigator;
