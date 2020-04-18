import useAsyncStorage from '@rnhooks/async-storage';

const DB_NAME = 'globalStorage';
const FIELD_KEY = 'IP';
const INITIAL_VALUE = '';

export function useRNStorage() {
  const [iCoffeeIP, updateiCoffeeIP, cleariCoffeeIP] = useAsyncStorage(
    INITIAL_VALUE,
  );
  
  return {
    iCoffeeIP,
    updateiCoffeeIP,
    cleariCoffeeIP
  };
}
