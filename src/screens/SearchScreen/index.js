import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-navigation';

/* from app */
import FlatList from 'src/components/FlatList';
import Text from 'src/components/Text';
import TextInput from 'src/components/TextInput';
import GA from 'src/analytics';
import I18n from 'src/i18n';
import styles from './styles';

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      keyword: null,
      tags: [],
      searching: false,
    };
    GA.ScreenHit('Search');
  }

  onChangeText = text => {
    clearTimeout(this.interval);
    this.setState({ keyword: text.replace(/^#/, ''), searching: true });
  };
  onRowPress = item => {
    const { navigation } = this.props;
    navigation.push('Tag', { tag: `#${item.name}` });
  };

  render() {
    const { keyword, tags, searching } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={tags}
            keyExtractor={item => item.key}
            ListHeaderComponent={
              <View style={styles.header}>
                <TextInput
                  style={styles.search}
                  value={keyword}
                  placeholder={I18n.t('Search.placeholder')}
                  underlineColorAndroid="transparent"
                  onChangeText={this.onChangeText}
                  clearButtonMode="while-editing"
                />{' '}
              </View>
            }
            renderItem={({ item }) => {
              if (searching) {
                return null;
              }
              return (
                <TouchableHighlight
                  underlayColor="rgba(0,0,0,0.1)"
                  sty
                  le={styles.row}
                  onPress={() => this.onRowPress(item)}
                >
                  <Text font="noto-sans-medium" style={styles.rowText}>
                    #{item.name}
                  </Text>
                </TouchableHighlight>
              );
            }}
            ListFooterComponent={() =>
              searching && keyword ? (
                <Text font="noto-sans-medium" style={styles.searching}>
                  #{keyword}
                  {I18n.t('Search.searching')}
                </Text>
              ) : null
            }
          />{' '}
        </View>
      </SafeAreaView>
    );
  }
}
