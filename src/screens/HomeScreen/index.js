import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Share,
  ActivityIndicator,
} from 'react-native';
import { WebBrowser } from 'expo';

/* from app */
import FlatList from 'src/components/FlatList';
import Item from 'src/components/Item';
import Text from 'src/components/Text';
import GA from 'src/analytics';
import I18n from 'src/i18n';
import styles from './styles';

export default class HomeScreen extends React.Component {
  static navigationOptions = () => ({
    headerTitle: I18n.t('Home.title'),
  });

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      fetching: false,
      loading: false,
    };
    GA.ScreenHit('Home');
  }

  onUserPress = item => {
    const { navigation } = this.props;
    navigation.push('User', { uid: item.user.uid });
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
    const { posts, fetching, loading } = this.state;
    if (posts.length === 0) {
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.container, styles.empty]}
        >
          <Text font="noto-sans-bold" style={styles.emptyText}>
            {I18n.t('Home.noPosts')}
          </Text>
        </ScrollView>
      );
    }
    return (
      <View style={styles.container} testID="Home">
        <FlatList
          data={posts}
          keyExtractor={item => item.key}
          renderItem={({ item, index, viewableItemIndices }) => (
            <Item
              {...item}
              visible={viewableItemIndices.indexOf(index) > -1}
              onUserPress={this.onUserPress}
              onMorePress={this.onMorePress}
              onLikePress={() => {}}
              onLinkPress={this.onLinkPress}
            />
          )}
          ListFooterComponent={() =>
            loading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="small" />
              </View>
            ) : null
          }
        />{' '}
      </View>
    );
  }
}
