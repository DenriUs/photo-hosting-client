import React, { useRef } from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Button } from 'react-native-paper';

interface IProps {
  tabs: { name: string; component: JSX.Element }[];
  tabBarWidth: number;
  onTabPress?: (tabIndex: number) => void;
  tabBarStyle?: StyleProp<ViewStyle>;
  tabsWrapperStyle?: StyleProp<ViewStyle>;
  tabButtonStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}

const tabBarIndicatorLeft = 40;

const TopTabBar = (props: IProps) => {
  const {
    tabs,
    tabBarWidth,
    onTabPress,
    tabBarStyle,
    tabsWrapperStyle,
    tabButtonStyle,
    labelStyle,
    indicatorStyle,
  } = props;

  const topTabBarRef = useRef<View>(null);

  const tabButtonWidth = tabBarWidth / tabs.length;
  const indicatorWidth = tabButtonWidth - tabBarIndicatorLeft * 2;

  const indicatorLeft = useSharedValue(tabBarIndicatorLeft);

  const indicatorLeftStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(indicatorLeft.value, {
        duration: 100,
      }),
    };
  });

  const switchTab = (tabIndex: number) => {
    indicatorLeft.value = tabBarIndicatorLeft + tabButtonWidth * tabIndex;
    onTabPress && onTabPress(tabIndex);
  };

  const renderedTabs = tabs.map((tab, index) => (
    <Button
      key={index}
      color="#3a2c3a"
      uppercase={false}
      onPress={() => switchTab(index)}
      labelStyle={[styles.tabButtonLabel, labelStyle]}
      style={[styles.tabButton, tabButtonStyle]}>
      <Text>{tab.name}</Text>
    </Button>
  ));

  return (
    <View ref={topTabBarRef} style={[styles.tabBar, tabBarStyle]}>
      <View style={[styles.tabWrapper, tabsWrapperStyle]}>{renderedTabs}</View>
      <View style={styles.indicatorWrapper}>
        <Animated.View
          style={[
            styles.indicator,
            { width: indicatorWidth },
            indicatorStyle,
            indicatorLeftStyle,
          ]}
        > 
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    width: '100%',
    alignItems: 'center',
  },
  indicatorWrapper: {
    width: '100%',
  },
  indicator: {
    borderWidth: 1,
    borderColor: '#f7623c',
  },
  tabWrapper: {
    flexDirection: 'row',
  },
  tabButtonLabel: {
    fontSize: 15,
    letterSpacing: 0,
  },
  tabButton: {
    flex: 1,
    borderRadius: -1,
  },
});

export default TopTabBar;
