import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, Text, Image } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addAccessedPhoto } from '../../api/requests/photo';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Searchbar, Title, TouchableRipple } from 'react-native-paper';
import { useState } from 'react';
import { searchUsersToSharePhoto } from '../../api/requests/user';
import { clearSearchedUsers, removeClickedUser } from '../../redux/slices/shareWithUsersSlice';

const SearchUsers = () => {
  const [searchValue, setSeatchValue] = useState('');

  const shareWithUsersState = useAppSelector((state) => state.shareWithUsers);
  const currentlyViewedPhoto = useAppSelector((state) => state.photoCarousel.currentlyViewedPhoto);
  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const onChangeText = (text: string) => {
    setSeatchValue(text);
    if (!text) {
      dispatch(clearSearchedUsers());
      return;
    }
    if (currentlyViewedPhoto) {
      dispatch(searchUsersToSharePhoto({ photoId: currentlyViewedPhoto._id, loginPart: text }));
    }
  }

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableRipple onPress={() => {
        if (currentlyViewedPhoto) {
          dispatch(removeClickedUser(item._id));
          dispatch(addAccessedPhoto({ userId: item._id, accessedPhotoId: currentlyViewedPhoto._id }));
        }
      }}>
        <View style={{ width: '100%', height: 70, flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingLeft: 10, marginTop: 10 }}>
          <View style={[styles.profileImageWrapper, { elevation: item.profilePhotoUrl ? 8 : 0 }]}>
            <Image
              {...(item.profilePhotoUrl
                ? { source: { uri: item.profilePhotoUrl } }
                : { source: require('../../../assets/default-profile-image.png') })}
              style={styles.profileImage}
            />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Title style={{ marginLeft: 10, fontSize: 20 }}>{item.login}</Title>
            <Text style={{ marginLeft: 10, fontSize: 13, bottom: 5 }}>{item.email}</Text>
          </View>
        </View>
      </TouchableRipple>
    ),
    [shareWithUsersState.searchedUsers]
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#3a2c3a" onPress={() => {
          dispatch(clearSearchedUsers());
          navigation.goBack();
        }} />
        <Appbar.Content title='Виберіть користувача' />
      </Appbar.Header>
      <Searchbar
        selectionColor='#3a2c3a'
        placeholder="Ім'я облікового запису"
        onChangeText={onChangeText}
        value={searchValue}
        style={{ elevation: 0, borderBottomWidth: 0.1 }}
      />
      <FlatList
        data={shareWithUsersState.searchedUsers}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Користувачів не знайдено</Text>
          </View>
        )}
        contentContainerStyle={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  profileImageWrapper: {
    borderRadius: 90,
    justifyContent: 'center',
    borderColor: '#ffffff',
    borderWidth: 2,
    elevation: 8,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 90,
  },
});

export default SearchUsers;
