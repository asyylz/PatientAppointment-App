import searchSliceReducer from './../store/search-slice';

describe('SearchSlice reducer', () => {
  it('1--Should return the initial state when passed an empty action', () => {
    const initialState = '';
    const action = { type: '' };
    const result = searchSliceReducer(initialState, action);
    expect(result).toEqual('');
  });
  it('2--Should set the search term received to state ', () => {
    const initialState = undefined;
    const action = {
      type: 'search/setSearch',
      payload: 'Bowen',
    };
    const result: string = searchSliceReducer(initialState, action);
    expect(result).toEqual('Bowen');
  });
});
