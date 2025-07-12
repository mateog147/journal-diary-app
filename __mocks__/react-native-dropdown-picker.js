// Mock for react-native-dropdown-picker
jest.mock('react-native-dropdown-picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  
  return function MockDropDownPicker(props) {
    return (
      <View>
        <Text>{props.value}</Text>
        {props.items.map(item => (
          <Text key={item.value} onPress={() => props.setValue(item.value)}>
            {item.label}
          </Text>
        ))}
      </View>
    );
  };
});
