import Datastore from 'react-native-local-mongodb';
const notification = new Datastore({
  filename: 'music',
  autoload: true,
});
export default {
  notification,
};
