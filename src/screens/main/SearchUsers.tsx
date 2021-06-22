import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addAccessedPhoto } from '../../api/requests/photo';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Appbar, Searchbar, Title } from 'react-native-paper';
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
      <TouchableOpacity onPress={() => {
        if (currentlyViewedPhoto) {
          dispatch(removeClickedUser(item._id));
          dispatch(addAccessedPhoto({ userId: item._id, accessedPhotoId: currentlyViewedPhoto._id }));
        }
      }}>
        <View style={{ width: '100%', height: 60, flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 10 }}>
          <MaterialIcons size={60} name='person' />
          <Title style={{ marginLeft: 10, fontSize: 20 }}>{item.login}</Title>
        </View>
      </TouchableOpacity>
    ),
    [shareWithUsersState.searchedUsers]
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#000000" onPress={() => {
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
});

export default SearchUsers;
