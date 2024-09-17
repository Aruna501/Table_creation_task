import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';
import tableReducer from '../features/tableSlice'; 

const tablePersistConfig = {
  key: 'table',
  storage,
  whitelist: ['filterOptions'], 
};

const persistedTableReducer = persistReducer(tablePersistConfig, tableReducer);

const rootReducer = combineReducers({
  table: persistedTableReducer, 
});

const store = configureStore({
  reducer: rootReducer,
});

const persistor = persistStore(store);

export { store, persistor };
