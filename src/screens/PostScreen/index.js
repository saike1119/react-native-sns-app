import React from 'react';
import { View, ScrollView, Share } from 'react-native';
import { WebBrowser } from 'expo';

/* from app */
import Item from 'src/components/Item';
import Text from 'src/components/Text';
import GA from 'src/analytics';
import I18n from 'src/i18n';
import styles from './styles';

export default class PostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('title', I18n.t('Post.loading')),
  });
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      fetching: false,
    };

    const { navigation } = this.props;
    GA.ScreenHit(`Post/${navigation.getParam('pid', 0)}`);
  }
  onUserPress = item => {
    const { navigation } = this.props;
    navigation.push('User', { uid: item.uid });
  };

  onMorePress = item => {
    Share.share({
      message: item.fileUri,
    });
  };

  onLinkPress = (url, txt) => {
    const { navigation } = this.props;
    switch (txt[0]) {
      case '#':
        navigation.push('Tag', { tag: txt });
        break;
      default:
        WebBrowser.openBrowserAsync(url);
        break;
    }
  };

  render() {
    const { error, fetching } = this.state;
    if (fetching) {
      return (
        <View style={[styles.container, styles.empty]}>
          <Text font="noto-sans-bold" style={styles.emptyText}>
            {I18n.t('Post.loading')}
          </Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={[styles.container, styles.empty]}>
          <Text font="noto-sans-bold" style={styles.emptyText}>
            {I18n.t('Post.noPost')}
          </Text>
        </View>
      );
    }
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.container}
      >
        <Item
          {...this.state}
          onUserPress={this.onUserPress}
          onMorePress={this.onMorePress}
          onLikePress={() => {}}
          onLinkPress={this.onLinkPress}
        />
      </ScrollView>
    );
  }
}
