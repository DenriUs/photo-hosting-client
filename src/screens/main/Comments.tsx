import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useCallback } from 'react';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TextInput, RefreshControl } from 'react-native';
import { Appbar, IconButton, TouchableRipple } from 'react-native-paper';
import { addComment, loadComments } from '../../api/requests/comments';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { sendComment } from '../../redux/slices/commentSlice';

const Comments = () => {
  const [textInputValue, setTextInputValue] = useState('');

  const navigation = useNavigation();

  const commentState = useAppSelector((state) => state.comment);
  const currentlyViewedPhoto = useAppSelector((state) => state.photoCarousel.currentlyViewedPhoto);
  const currentUserId = useAppSelector((state) => state.user.userData._id);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentlyViewedPhoto) {
      dispatch(loadComments({ photoId: currentlyViewedPhoto._id }));
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableRipple>
        <View
          style={{
            width: '100%',
            height: 70,
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
            paddingLeft: 10,
            marginTop: 10,
          }}>
          <View style={styles.profileImageWrapper}>
            <Image
              {...(item.authorId.profilePhotoUrl
                ? { source: { uri: item.profilePhotoUrl } }
                : { source: require('../../../assets/default-profile-image.png') })}
              style={styles.profileImage}
            />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginLeft: 10, fontSize: 13, fontWeight: 'bold' }}>
                {item.authorId.login}
              </Text>
              <Text style={{ marginLeft: 5, fontSize: 12 }}>{item.text}</Text>
            </View>
            <View>
              <Text style={{ marginLeft: 10, fontSize: 12, fontWeight: 'bold', color: 'grey' }}>
                {item.creationDate}
              </Text>
            </View>
          </View>
        </View>
      </TouchableRipple>
    ),
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          color="#000000"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Коментарі" />
      </Appbar.Header>
      <FlatList
        data={commentState.comments}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={commentState.loading}
            onRefresh={() => {
              if (currentlyViewedPhoto) {
                dispatch(loadComments({ photoId: currentlyViewedPhoto._id }));
              }
            }}
            colors={['#3a2c3a', '#f7623c']}
          />
        }
        contentContainerStyle={{ marginRight: 40 }}
      />
      <View style={{ flexDirection: 'row' }}>
        <View
          style={[
            styles.profileImageWrapper,
            { position: 'absolute', alignSelf: 'flex-end', marginLeft: 10, bottom: 12 },
          ]}>
          <Image
            source={{ uri: `https://picsum.photos/400/400?random=1}` }}
            style={styles.profileImage}
          />
        </View>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <TextInput
            placeholder="Додайте коментар..."
            selectionColor="#3a2c3a"
            multiline
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            value={textInputValue}
            onChangeText={setTextInputValue}
            style={{ width: '75%', padding: 20, marginLeft: 10 }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
            bottom: 7,
          }}>
          <IconButton
            icon="send"
            size={27}
            color="#f7623c"
            onPress={() => {
              if (currentlyViewedPhoto) {
                const comment = {
                  authorId: currentUserId,
                  photoId: currentlyViewedPhoto._id,
                  creationDate: new Date().toISOString(),
                  text: textInputValue,
                };
                dispatch(addComment(comment));
                dispatch(sendComment(comment));
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  profileImageWrapper: {
    borderRadius: 90,
    justifyContent: 'center',
    borderColor: '#ffffff',
    borderWidth: 2,
    elevation: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 90,
  },
  input: {
    backgroundColor: 'red',
    width: '100%',
    height: 40,
    color: '#ffffff',
  },
});
