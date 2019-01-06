import React from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { Video, Permissions, ImagePicker } from 'expo';

/* node_modules */
import { Image } from 'react-native-expo-image-cache';

/* from app */
import Avatar from 'src/components/Avatar';
import FlatList from 'src/components/FlatList';
import Text from 'src/components/Text';
import GA from 'src/analytics';
import I18n from 'src/i18n';
import styles from './styles';

@connect(state => ({
  me: state.me,
}))
export default class UserScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('title', I18n.t('User.loading')),
  });

  constructor(props) {
    super(props);

    const { me, navigation } = this.props;
    const uid = navigation.getParam('uid', me.uid);
    this.state = {
      self: me.uid === uid,
      user: {},
      posts: [],
      cursor: null,
      fetching: false,
      loading: false,
    };
    GA.ScreenHit(me.uid === uid ? `User/${uid}` : 'Me');
  }

  async componentDidMount() {
    const { self } = this.state;
    const { me, navigation } = this.props;
    if (self) {
      await this.setState({ user: me });
      navigation.setParams({ title: I18n.t('User.self') });
    } else {
      const user = {
        uid: null,
        name: 'username',
        img: null,
      };
      await this.setState({ user });
      navigation.setParams({ title: user.name });
    }
    await this.getPosts();
  }

  componentDidUpdate(prevProps) {
    const { self } = this.state;
    const { me } = this.props;
    if (prevProps.me !== me && self) {
      this.setState({ user: me });
    }
  }

  onUserPress = async () => {
    const { me, dispatch } = this.props;

    const permissions = Permissions.CAMERA_ROLL;
    const { status } = await Permissions.askAsync(permissions);
    if (status) {
      const photo = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!photo.cancelled) {
        if (!response.error) {
          dispatch({
            type: 'ME_SET',
            payload: { ...me, img: photo.uri },
          });
        }
      }
    }
  };
  onThumbnailPress = item => {
    const { navigation } = this.props;
    navigation.push('Post', { pid: item.pid });
  };

  render() {
    const { self, user, posts, fetching, loading } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.thumbnails}
          numColumns={3}
          data={posts}
          keyExtractor={item => item.key}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              {!self && (
                <Avatar uri={user.img} size={60} style={styles.avatar} />
              )}
              } />
              {self && (
                <TouchableOpacity onPress={this.onUserPress}>
                  <Avatar uri={user.img} size={60} style={styles.avatar} />
                </TouchableOpacity>
              )}
              <Text font="noto-sans-medium" style={styles.name}>
                {user.name}
              </Text>
            </View>
          )}
          renderItem={({ item, index, viewableItemIndices }) => {
            if (viewableItemIndices.indexOf(index) === -1) {
              return <View style={styles.file} />;
            }
            return (
              <TouchableOpacity onPress={() => this.onThumbnailPress(item)}>
                {item.type === 'photo' && (
                  <Image uri={item.thumbnail} s tyle={styles.file} />
                )}
                {item.type === 'movie' && (
                  <Video
                    source={{ uri: item.thumbnail }}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.file}
                  />
                )}
              </TouchableOpacity>
            );
          }}
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
