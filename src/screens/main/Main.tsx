import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Main = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Text>Main Screen</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default Main;
