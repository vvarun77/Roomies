import isEmpty from 'lodash/isEmpty';
import React, { useCallback } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Button } from 'react-native';

import { styles } from '../Style';

const AgendaItem = (props) => {
    const { item } = props.item;
    if (isEmpty(item)) {
        return (
          <View>
            <Text>No Events Planned Today</Text>
          </View>
        );
      }
    return (
        <TouchableOpacity>
            <View>
                <Text>{item.title}</Text>
                <Text>{item.duration}</Text>
            </View>
        </TouchableOpacity>
    );
}
export default AgendaItem;