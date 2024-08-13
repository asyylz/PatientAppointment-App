import renderer from 'react-test-renderer';
import ContactPage from './ContactPage';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
const mockStore = configureStore();
import '@testing-library/jest-dom';

describe('ContactPage', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
  });

  it('matches the DOM snapshot', () => {
    let domTree;
    try {
      domTree = renderer
        .create(
          <Provider store={store}>
            <MemoryRouter>
              <ContactPage />
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
    } catch (error) {
      console.error('Rendering error:', error);
    }
    console.log(domTree); // Log the rendered tree to debug
    expect(domTree).toMatchSnapshot();
  });
});
