import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, StatusBar, Image, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Title } from 'react-native-paper';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { getPercentageFromNumber } from '../../helpers/calculation';

const PhotoLibrary = () => {
  const { height, width } = useWindowDimensions();

  const data = useMemo(

    () =>
      Array(39)
        .fill(0)
        .map(() => (
          <View style={{ alignItems: 'center', borderWidth: 1.5, borderTopWidth: 3, borderBottomWidth: 0, borderColor: '#ffffff' }}>
            <Image source={require('../../../assets/profile-image.png')} style={{ width: width / 3.05, height: width / 3 }} />
          </View>
        )),
    []
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View>
        {item}
      </View>
    ),
    []
  );
  return (
    <BottomSheetFlatList
      showsVerticalScrollIndicator={false}
      numColumns={3}
      data={data}
      keyExtractor={(_element, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ alignItems: 'center', marginTop: 0.5 }}
    />
  );
}

const Featured = () => {
  const { height, width } = useWindowDimensions();

  const data = useMemo(
    () =>
      Array(3)
        .fill(0)
        .map(() => (
          <View style={{ alignItems: 'center', borderWidth: 1.5, borderTopWidth: 3, borderBottomWidth: 0, borderColor: '#ffffff' }}>
            <Image source={require('../../../assets/profile-image.png')} style={{ width: width / 3.05, height: width / 3 }} />
          </View>
        )),
    []
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View>
        {item}
      </View>
    ),
    []
  );
  return (
    <BottomSheetFlatList
      showsVerticalScrollIndicator={false}
      numColumns={3}
      data={data}
      keyExtractor={(_element, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ alignItems: 'center', marginTop: 0.5 }}
    />
  );
}

const Tab = createMaterialTopTabNavigator();

const Profile = () => {
  const { width, height } = useWindowDimensions();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['50%', '92%'], []);
  
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const tabButtonWidth = width / 2;
  const indicatorWidth = width / 2 - 40 * 2;

  return (
    <View style={[{ height: '100%' }]}>
      <StatusBar translucent />
      <View style={{ position: 'absolute', height: '45%', width: '100%', alignItems: 'center', backgroundColor: '#f5e0ce', justifyContent: 'flex-end' }}>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}><Button onPress={() => console.log(12345)}><Text>Підписатися</Text></Button></View>
        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ width: '100%', alignItems: 'center', backgroundColor: '#ffffff', borderTopLeftRadius: 80, borderTopRightRadius: 80 }}>
            <View style={{ borderColor: '#ffffff', borderWidth: 5, borderRadius: 80 }}>
              <Image source={require('../../../assets/profile-image.png')} style={{ width: 120, height: 120, borderRadius: 80 }} />
            </View>
            <Title style={{ fontSize: 25, color: '#3a2c3a' }}>Username</Title>
            <Button onPress={() => console.log(12345)}><Text>Підписатися</Text></Button>
          </View>
        </View>
      </View>
      <View style={{ height: '100%', width: '100%' }}>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          overDragResistanceFactor={0}
          handleComponent={() => null}
        >
          <Tab.Navigator
            tabBarPosition='top'
            tabBarOptions={{
              activeTintColor: '#3a2c3a',
              inactiveTintColor: 'rgba(0, 0, 0, 0.2)',
              showIcon: true,
              showLabel: false,
              indicatorStyle: {
                width: indicatorWidth,
                borderWidth: 1,
                borderColor: '#f7623c',
                left: (width / 2 - indicatorWidth) / 2
              },
              labelStyle: {
                fontSize: 15,
                color: '#3a2c3a'
              }
            }}
            screenOptions={({ route }) => ({
              tabBarLabel: '',
              tabBarIcon: ({ color, focused }) => {
                let iconName: 'image-multiple' | 'image-multiple-outline' | 'star' | 'star-outline' = 'image-multiple';
                if (route.name === 'Featured') {
                  iconName = focused ? 'star' : 'star-outline';
                }
                return <MaterialCommunityIcons name={iconName} size={26} color={color} />
              }
            })}
          >
            <Tab.Screen name='PhotoLibrary' component={PhotoLibrary} />
            <Tab.Screen name='Featured' component={Featured} />
          </Tab.Navigator>
        </BottomSheet>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    height: '22%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5e0ce',
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  bottomSheetHeader: {
    backgroundColor: '#ffffff',
    paddingTop: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 0.5,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 10
  },
  panelHandle: {
    width: 35,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
});

export default Profile;
