import React from 'react';
import { AppLoading, Font, Asset } from 'expo';
/* from app */
import Navigation from 'src';
import fonts from 'src/fonts';
import images from 'src/images';
import firebase from 'src/firebase';

export default class App extends React.Component {
  static defaultprops = {
    skipLoadingScreen: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
    };
  }

  loadResourcesAsync = async () => {
    /* firebase */
    await firebase.init();
    /* asset */
    await Asset.loadAsync(Object.keys(images).map(key => images[key]));
    /* font */
    await Font.loadAsync(fonts);
    return true;
  };
  firebase;

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={error => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      );
    }
    return <Navigation />;
  }
}
