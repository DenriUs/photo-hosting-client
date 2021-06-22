import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, Button } from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { Appbar, IconButton, Title, TouchableRipple } from 'react-native-paper';

const Comments = () => {
  const [inputHeight, setInputHeight] = useState(55);

  const navigation = useNavigation();

  const { width } = useSafeAreaFrame();

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableRipple>
        <View style={{ width: '100%', height: 70, flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingLeft: 10, marginTop: 10 }}>
          <View style={styles.profileImageWrapper}>
            <Image
              {...(item.profilePhotoUrl
                ? { source: { uri: item.profilePhotoUrl } }
                : { source: {uri: `https://picsum.photos/400/400?random=${item.index}` } })}
              style={styles.profileImage}
            />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginLeft: 10, fontSize: 13, fontWeight: 'bold' }}>someones_username</Text>
              <Text style={{ marginLeft: 5, fontSize: 12 }}>textxtxt</Text>
            </View>
            <View>
              <Text style={{ marginLeft: 10, fontSize: 12, fontWeight: 'bold', color: 'grey' }}>2 дн.</Text>
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
        <Appbar.BackAction color="#000000" onPress={() => {
          navigation.goBack();
        }} />
        <Appbar.Content title='Коментарі' />
      </Appbar.Header>
      <FlatList
        data={Array(50).fill(0)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ marginRight: 40 }}
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.profileImageWrapper, { position: 'absolute', alignSelf: 'flex-end', marginLeft: 10, bottom: 12 }]}>
          <Image source={{uri: `https://picsum.photos/400/400?random=1}`}}
            style={styles.profileImage}
          />
        </View>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <TextInput
            placeholder='Додайте коментар...'
            selectionColor='#3a2c3a'
            multiline
            placeholderTextColor='rgba(0, 0, 0, 0.3)'
            style={{ width: '75%', padding: 20, marginLeft: 10  }}
          />
        </View>
        <View style={{ position: 'absolute', width: '100%', justifyContent: 'center', alignItems: 'flex-end', alignSelf: 'flex-end', bottom: 7 }}>
          <IconButton icon='send' size={27} onPress={() => {}} />
        </View>
      </View>
    </View>
  )
}

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
    color: '#ffffff'
  },
});