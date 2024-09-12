import currentUserReducer, {
  logout,
  performLogout,
  refreshSession,
  register,
  updateUserInfo,
} from '../currentUser-slice/currentUser-slice';
import '@testing-library/jest-dom';
//import { toastSuccessNotify } from './../helper/ToastNotify';
import { login } from '../currentUser-slice/currentUser-slice';
import * as axiosInterceptors from '../../services/axiosInterceptors';
import * as timers from '../../helper/timers';
//import * as toastNotify from './../helper/ToastNotify';

jest.mock('redux-persist');

// Assuming toastSuccessNotify is a named export
//jest.doMock('./../helper/ToastNotify')
// jest.doMock('./../helper/ToastNotify', () => ({
//   toastSuccessNotify: jest.fn(),
// }));

interface TestAction {
  type: string;
  payload?: any;
  [key: string]: any;
}
const actionApplier = (
  initialState: string | object | undefined,
  action: TestAction
) => {
  const state = currentUserReducer(initialState as CurrentUser, action);
  return state;
};

const thunkActionApplier = async (
  thunkAction: any,
  actionName: string,
  status: string,
  state: CurrentUser = {
    status: 'idle',
    token: '',
    userData: null,
  },
  message?: string
) => {
  const dispatch = jest.fn();

  // The first thing a thunk function takes is the dispatch method. The second thing is a method called getState(). We can reproduce that here by sending an error function that just returns the state.
  await thunkAction(dispatch, () => state, undefined);
  const { calls } = dispatch.mock;
  // console.log(calls);
  // console.log(calls[1][0])
  expect(calls).toHaveLength(2);

  expect(calls[0][0].type).toEqual(`currentUser/${actionName}/pending`);
  expect(calls[1][0].type).toEqual(`currentUser/${actionName}/${status}`);
  //console.log(message);
  if (status === 'rejected') {
    // console.log(calls[1][0].error);
    expect(calls[1][0].error).toEqual({
      message, // message:message
    });
  }
};

jest.mock('../../services/axiosInterceptors');

describe('CurrentUser-Slice reducer actions', () => {
  it('1--Logout', () => {
    const initialState = {
      token: '12345',
      userData: {
        _id: '1234',
        name: 'Alice',
        email: 'Smith',
        // other fields
      },
      error: null,
      status: 'login success',
    } as CurrentUser;

    const action = logout();
    const state = currentUserReducer(initialState, action);
    expect(state).toEqual({
      status: 'idle',
      token: '',
      userData: null,
      error: null,
    });
  });
});

describe('CurrentUser-Slice reducer thunk actions', () => {
  describe('Login', () => {
    beforeEach(() => {});
    it('1--Should login', async () => {
      axiosInterceptors.axiosInterceptorsWithoutToken.post = jest
        .fn()
        .mockResolvedValue({ data: { token: '12345' } });
      const thunk = login({
        email: 'alice@test.com',
        password: '6946224Asy!',
      });
      thunkActionApplier(thunk, 'login', 'fulfilled');
      //expect(toast.success).toHaveBeenCalled()
      //expect(toastNotify.toastSuccessNotify).toHaveBeenCalled();
      //expect(toastSuccessNotify).toHaveBeenCalledTimes(1);
    });

    it('Should fail with wrong credentials', async () => {
      // to simulate a failure, we need to mock a rejected promise using mockRejectedValue.
      // Mocking a failed login response
      axiosInterceptors.axiosInterceptorsWithoutToken.post = jest
        .fn()
        .mockRejectedValue({
          response: {
            data: { error: 'Login failed!' },
            status: 401, // Assuming 401 Unauthorized
            statusText: 'Unauthorized',
          },
          message: 'Request failed with status code 401',
        });
      const thunk = login({
        email: 'alice@test.com',
        password: 'wrong_password',
      });
      thunkActionApplier(
        thunk,
        'login',
        'rejected',
        undefined,
        'Request failed with status code 401'
      );
    });
  });
  describe('Register', () => {
    it('1--Should register', async () => {
      axiosInterceptors.axiosInterceptorsWithoutToken.post = jest
        .fn()
        .mockResolvedValue({ data: { token: '12345' } });
      const thunk = register({
        name: 'Alice',
        email: 'alice@test.com',
        password: '6946224Asy!',
        passwordConfirm: '6946224Asy!',
        policy: true,
      });
      thunkActionApplier(thunk, 'register', 'fulfilled');
    });
    it('Should fail with wrong credentials', async () => {
      axiosInterceptors.axiosInterceptorsWithoutToken.post = jest
        .fn()
        .mockRejectedValue({
          response: {
            data: { error: 'Register failed!' },
            status: 500,
            statusText: 'Unauthorized',
          },
          message: 'Request failed with status code 500',
        });

      const thunk = register({
        name: 'Alice',
        email: 'alice@test.com',
        password: '6946224Asy!',
        passwordConfirm: '6946224Asy!',
        policy: true,
      });
      thunkActionApplier(
        thunk,
        'register',
        'rejected',
        undefined,
        'Request failed with status code 500'
      );
    });
  });

  describe('Refresh Session', () => {
    it('1--Should refresh', () => {
      axiosInterceptors.axiosInterceptorsWithToken.post = jest
        .fn()
        .mockResolvedValue({
          data: { status: 'success', token: 'afterRefreshToken' },
        });

      const initialState: CurrentUser = {
        token: 'beforeRefreshToken',
        userData: { _id: '1234', name: 'Alice' } as userData,
        status: 'idle',
      };
      const thunk = refreshSession();
      thunkActionApplier(thunk, 'refreshSession', 'fulfilled', initialState);
    });
    it('2--Refresh fails', () => {
      axiosInterceptors.axiosInterceptorsWithToken.post = jest
        .fn()
        .mockRejectedValue({
          response: {
            data: { error: 'Refresh failed!' },
            status: 500,
            statusText: 'Unauthorized',
          },
          message: 'Refresh request failed with status code 500',
        });

      const initialState: CurrentUser = {
        token: 'beforeRefreshToken',
        userData: { _id: '1234', name: 'Alice' } as userData,
        status: 'idle',
      };
      const thunk = refreshSession();
      thunkActionApplier(
        thunk,
        'refreshSession',
        'rejected',
        initialState,
        'Refresh request failed with status code 500'
      );
    });
  });
  describe('UpdateUserInfo', () => {
    it('1--Should update user info', () => {
      axiosInterceptors.axiosInterceptorsWithToken.patch = jest
        .fn()
        .mockResolvedValue({ data: { user: { _id: '1234', name: 'Alice' } } });

      const initialState: CurrentUser = {
        token: '12345',
        userData: { _id: '1234', name: 'Bob' } as userData,
        status: 'idle',
      };
      const formData = new FormData();
      formData.append('name', 'Alice');
      const thunk = updateUserInfo(formData);
      thunkActionApplier(thunk, 'updateProfile', 'fulfilled', initialState);
    });
    it('2--Should updateUserInfo fail', () => {
      axiosInterceptors.axiosInterceptorsWithToken.patch = jest
        .fn()
        .mockRejectedValue({
          response: {
            data: { error: 'Update failed!' },
            status: 500,
            statusText: 'Unauthorized',
          },
          message: 'Update request failed with status code 500',
        });

      const initialState: CurrentUser = {
        token: '12345',
        userData: { _id: '1234', name: 'Bob' } as userData,
        status: 'idle',
      };
      const formData = new FormData();
      formData.append('name', 'Alice');
      const thunk = updateUserInfo(formData);
      thunkActionApplier(
        thunk,
        'updateProfile',
        'rejected',
        initialState,
        'Update request failed with status code 500'
      );
    });
  });
  describe('', () => {});
});

jest.mock('../../helper/timers');

describe('PerfomLogout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('1--Should call the logout API, dispatch logout action, and stop the token interval', async () => {
    const dispatch = jest.fn();
    axiosInterceptors.axiosInterceptorsWithToken.get = jest
      .fn()
      .mockResolvedValue({ data: { status: 'success' } });

    // Call the performLogout function
    await performLogout()(dispatch);
    // Check that the API call was made
    expect(
      axiosInterceptors.axiosInterceptorsWithToken.get
    ).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/logout');

    // Check that the logout action was dispatched
    expect(dispatch).toHaveBeenCalledWith(logout());

    // Check that stopTokenCheckInterval was called
    expect(timers.stopTokenCheckInterval).toHaveBeenCalled();
  });
  it('2--Should call the logout API,  not dispatch logout action, and not stop the token interval', async () => {
    const dispatch = jest.fn();
    axiosInterceptors.axiosInterceptorsWithToken.get = jest
      .fn()
      .mockResolvedValue({
        data: {
          status: 'fail',
          error: { message: 'Logout request failed with status code 500' },
        },
      });
    // Call the performLogout function
    await performLogout()(dispatch);
    expect(
      axiosInterceptors.axiosInterceptorsWithToken.get
    ).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/logout');

    // Check that the logout action was not dispatched
    expect(dispatch).not.toHaveBeenCalledWith(logout());

    // Check that stopTokenCheckInterval was not called
    expect(timers.stopTokenCheckInterval).toHaveBeenCalledTimes(0);
  });
});

describe('CurrentUser-slice states with thunk', () => {
  describe('Login', () => {
    it('1--Should return the initial state when passed an empty action', () => {
      // it will detect that the state is undefined and will return the initial state specified within the reducer itself.
      const result = actionApplier(undefined, { type: '' });
      expect(result).toEqual({
        token: '',
        userData: null,
        status: 'idle',
        //error: null,
      });
    });
    it('2--Should status pending before login/fulfilled action', () => {
      const result = actionApplier(undefined, {
        type: 'currentUser/login/pending',
      });
      expect(result).toEqual({
        token: '',
        userData: null,
        status: 'loading',
      });
    });
    it('3--Should return the user,token,login success and error null state when passed  login action', () => {
      const payloadData = {
        token: 'mockToken',
        data: {
          user: {
            _id: '6673662fbd42a966b75dec92',
            name: 'test name',
            email: 'test@test.com',
            role: 'patient',
            __v: 0,
            DOB: '1986-01-22T00:00:00.000Z',
            image:
              'https://patient-appointment-system.s3.eu-west-2.amazonaws.com/1722605356602-asiye%20serife.jpeg',
            address: {
              street: '14 Burleigh Road',
              city: 'London',
              town: 'London Borough of Sutton',
              country: 'United Kingdom',
              postalCode: 'SM3 9NB',
              _id: '669326cd61fc1f2be5b69ddb',
            },
            updatedAt: '2024-08-07T09:10:15.770Z',
            policy: true,
            passwordResetExpires: '2024-08-07T09:20:15.769Z',
            passwordResetToken:
              '13cc0b1f73424bbb4b7f633cf94bba8d12e8fe0459b1a669b5824bdafc44f574',
          },
        },
      };
      const action = {
        type: 'currentUser/login/fulfilled',
        payload: payloadData,
      };
      const result = actionApplier(undefined, action);
      expect(result).toEqual({
        token: payloadData.token,
        userData: payloadData.data.user,
        status: 'login success',
        error: null,
      });
    });
    it('4--Should return error in  currentUser/login/rejected with error message property', () => {
      const action = {
        type: 'currentUser/login/rejected',
        error: { message: 'Login mock error occurred' },
      };
      const result = actionApplier(undefined, action);
      expect(result).toEqual({
        token: '',
        userData: null,
        status: 'login failed',
        error: 'Login mock error occurred',
      });
    });
    it('5--Should return error in  currentUser/login/rejected without error message property and default error message', () => {
      const action = {
        type: 'currentUser/login/rejected',
      };
      const result = actionApplier(undefined, action);
      expect(result).toEqual({
        token: '',
        userData: null,
        status: 'login failed',
        error: 'Login failed!',
      });
    });
  });
  describe('Refresh Session', () => {
    it('1--Request refreshSession should be succeedeed', () => {
      const action = {
        type: 'currentUser/refreshSession/fulfilled',
        payload: {
          token: 'refresh mockToken',
          data: {
            user: {
              _id: '6673662fbd42a966b75dec92',
              name: 'test name',
              email: 'test@test.com',
              role: 'patient',
              // other fields
            },
          },
        },
      };
      const result = actionApplier(
        { token: 'mockToken' } as CurrentUser,
        action
      );
      expect(result).toEqual({
        token: 'refresh mockToken',
        status: 'refresh success',
        error: null,
        userData: {
          _id: '6673662fbd42a966b75dec92',
          name: 'test name',
          email: 'test@test.com',
          role: 'patient',
          // other fields
        },
      });
    });
    it('2--Request refreshSession rejected error should be in state', () => {
      const action = {
        type: 'currentUser/refreshSession/rejected',
        error: { message: 'Refresh unsuccessful' },
      };
      const result = actionApplier(
        { token: 'mockToken' } as CurrentUser,
        action
      );
      expect(result).toEqual({
        status: 'refresh failed',
        error: 'Refresh unsuccessful',
        token: '',
      });
    });
  });

  describe('Register', () => {
    it('1--Register pending action  should start with status pending', () => {
      const action = {
        type: 'currentUser/register/pending',
      };
      const result = actionApplier(undefined, action);
      expect(result).toEqual({
        status: 'loading',
        token: '',
        userData: null,
      });
    });
    it('2--Register fulfilled action should update state with new userData', () => {
      const payloadData = {
        token: 'someToken',
        error: null,
        data: {
          user: {
            _id: '6673662fbd42a966b75dec92',
            name: 'test name for register',
            email: 'test@test.com',
            role: 'patient',
            // other fields}
          },
        },
      };
      const action = {
        type: 'currentUser/register/fulfilled',
        payload: payloadData,
      };
      const result = actionApplier(undefined, action);
      expect(result).toEqual({
        status: 'register success',
        userData: payloadData.data.user,
        token: payloadData.token,
        error: null,
      });
    });
    it('3-Register rejected action should update error state with error', () => {
      const action = {
        type: 'currentUser/register/rejected',
        error: { message: 'Registration failed' },
      };
      const result = actionApplier(undefined, action);
      expect(result).toEqual({
        status: 'register failed',
        userData: null,
        token: '',
        error: 'Registration failed',
      });
    });
  });
  describe('UpdateUserInfo', () => {
    it('1--UpdateUserInfo fulfilled action should  update states with success', () => {
      const payloadData = {
        data: {
          user: {
            _id: '6673662fbd42a966b75dec92',
            name: 'test name for update user info',
            email: 'updatedemail@test.com',
            role: 'patient',
            // other fields
          },
        },
      };
      const action = {
        type: 'currentUser/updateProfile/fulfilled',
        payload: payloadData,
      };
      const result = actionApplier(
        { token: 'oldToken', userData: {} } as CurrentUser,
        action
      );
      expect(result).toEqual({
        token: 'oldToken',
        status: 'update success',
        userData: payloadData.data.user,
        error: null,
      });
    });
    it('2--UpdateUserInfo rejected action should  update error state', () => {
      const action = {
        type: 'currentUser/updateProfile/rejected',
        //error: { message: 'Updating user info failed' },
      };
      const result = actionApplier(
        { token: 'oldToken', userData: {} } as CurrentUser,
        action
      );
      expect(result).toEqual({
        token: 'oldToken',
        userData: {},
        status: 'update failed',
        error: 'Updating user info failed',
      });
    });
  });
  describe('StateToIdle', () => {
    it('1--StateToIdle action should set state to idle', () => {
      const action = {
        type: 'currentUser/stateToIdle',
      };
      const result = actionApplier({ status: 'some status' }, action);
      expect(result.status).toEqual('idle');
    });
  });
});
