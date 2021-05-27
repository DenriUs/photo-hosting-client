import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import { FORM_ICON_SIZE } from '../../other/constants';

interface IProps {
  title?: string;
  backActionIcon?: string;
  onBackActionPress?: () => void;
};

const CustomHeader = (props: IProps) => {
  const {
    title,
    backActionIcon,
    onBackActionPress,
  } = props;

  return (
    <View style={styles.headerContainer}>
      {onBackActionPress && backActionIcon && (
        <IconButton
          icon={backActionIcon}
          size={FORM_ICON_SIZE + 5}
          color='#3a2c3a'
          {...onBackActionPress && { onPress: onBackActionPress }}
          style={styles.backActionIcon}
        />
      )}
      <View style={styles.titleWrapper}>
        <Title style={styles.title}>
          {title}
        </Title>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backActionIcon: {
    position: 'absolute',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#3a2c3a',
  },
});

export default CustomHeader;

