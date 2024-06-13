import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native';

// Define the type for your data items
interface Item {
  id: string;
  name: string;
}

// Define the props type for MyComponent
interface MyComponentProps {
  data: Item[];
}

const MyComponent: React.FC<MyComponentProps> = ({data}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [dataSource, setDataSource] = useState<Item[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

// Debounce function to limit the rate at which a function can fire.

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDataSource(data.filter(item => item.name.includes(term)));
    }, 300),
    [data],
  );
// useEffect hook to call the debouncedSearch function whenever the searchTerm changes.
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);


  // Function to handle item selection
  const handleSelect = (item: Item) => {
    setSelectedItems(currentSelectedItems => {
      const newSelectedItems = new Set(currentSelectedItems);
      if (newSelectedItems.has(item.id)) {
        newSelectedItems.delete(item.id);
      } else {
        newSelectedItems.add(item.id);
      }
      return newSelectedItems;
    });
  };


  // Function to clear the search input
  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.clear();
    }
    setSearchTerm("");
  };


  // Function to render each item in the FlatList
  const renderItem = ({item}: ListRenderItemInfo<Item>) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      style={styles.itemContainer}>
	<Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>
	  {selectedItems.has(item.id) ? 'Selected' : 'Not selected'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput
        ref={inputRef}
        onChangeText={setSearchTerm}
        value={searchTerm}
        placeholder="Search..."
        style={styles.searchInput}
      />
      <TouchableOpacity onPress={handleClear}>
        <Text>Clear</Text>
      </TouchableOpacity>
      <FlatList
        data={dataSource}
        keyExtractor={item => item.id}
        extraData={selectedItems}
        renderItem={renderItem}
      />
    </View>
  );
};

// Debounce function to limit the rate at which a function can fire.
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): T {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
}

// Styles
const styles = StyleSheet.create({
  itemContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
  },
  searchInput: {
    margin: 10,
    padding: 10,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
});

export default MyComponent;
