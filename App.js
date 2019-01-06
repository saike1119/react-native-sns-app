import React from 'react';
import { AppLoading, Font, Asset } from 'expo';
/* from app */
import Navigation from 'src';
import fonts from 'src/fonts';
import images from 'src/images';

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
    /* asset */
    await Asset.loadAsync(Object.keys(images).map(key => images[key]));
    /* font */
    await Font.loadAsync(fonts);
    return true;
  };

  render() {
    const { isLoadingComplete } = this.state;
    const { skipLoadingScreen } = this.props;

    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={error => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      );
    }
  }
}
