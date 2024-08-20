import currentUserSliceReducer from './currentUser-slice';
import '@testing-library/jest-dom';

jest.mock('redux-persist');

interface TestAction {
  type: string;
  payload?: any;
  [key: string]: any;
}
const actionApplier = (
  initialState: string | object | undefined,
  action: TestAction
) => {
  const state = currentUserSliceReducer(initialState as CurrentUser, action);
  return state;
};

describe('currentUser-slice', () => {
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
  it('6--Request refreshSession should be succeedeed', () => {
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
    const result = actionApplier({ token: 'mockToken' } as CurrentUser, action);
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
  it('7--Request refreshSession rejected error should be in state', () => {
    const action = {
      type: 'currentUser/refreshSession/rejected',
      error: { message: 'Refresh unsuccessful' },
    };
    const result = actionApplier({ token: 'mockToken' } as CurrentUser, action);
    expect(result).toEqual({
      status: 'refresh failed',
      error: 'Refresh unsuccessful',
      token: '',
    });
  });
  it('8--Register pending action  should start with status pending', () => {
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
  it('9--Register fulfilled action should update state with new userData', () => {
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
  it('10-Register rejected action should update error state with error', () => {
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
  it('11--UpdatePassword fulfilled action should update password and send new token', () => {
    const payloadData = {
      token: 'newToken',
      //error: null,
      data: {
        user: {
          _id: '6673662fbd42a966b75dec92',
          name: 'test name for update password',
          email: 'test@test.com',
          role: 'patient',
          // other fields
        },
      },
    };
    const action = {
      type: 'currentUser/updatePassword/fulfilled',
      payload: payloadData,
    };
    const result = actionApplier(
      { token: 'oldToken', userData: {} } as CurrentUser,
      action
    );
    expect(result).toEqual({
      status: 'updatePassword success',
      userData: payloadData.data.user,
      token: payloadData.token,
      error: null,
    });
  });
  it('12--Logout fulfilled action should empty states', () => {
    const action = {
      type: 'currentUser/logout/fulfilled',
    };
    const result = actionApplier(
      { token: 'oldToken', userData: {} } as CurrentUser,
      action
    );
    expect(result).toEqual({
      token: '',
      userData: null,
      status: 'logout success',
      error: null,
    });
  });
  it('13--Logout rejected action should return error', () => {
    const action = {
      type: 'currentUser/logout/rejected',
      error: { message: 'Logout failed' },
    };
    const result = actionApplier(
      { token: 'oldToken', userData: {} } as CurrentUser,
      action
    );
    expect(result).toEqual({
      token: 'oldToken',
      userData: {},
      status: 'logout failed',
      error: 'Logout failed',
    });
  });
  it('14--UpdateUserInfo fulfilled action should  update states with success', () => {
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
  it('15--UpdateUserInfo rejected action should  update error state', () => {
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
  it('16--ForgotPassword fulfilled action should update status state', () => {
    const action = {
      type: 'currentUser/forgotPassword/fulfilled',
    };
    const result = actionApplier(undefined, action);
    expect(result).toEqual({
      status: 'forgotPassword success',
      token: '',
      userData: null,
    });
  });
  it('17--ForgotPassword rejected action should update status', () => {
    const action = {
      type: 'currentUser/forgotPassword/rejected',
      error: { message: 'Forgot password failed' },
    };
    const result = actionApplier(undefined, action);
    expect(result).toEqual({
      status: 'forgotPassword failed',
      token: '',
      userData: null,
      error: 'Forgot password failed',
    });
  });
  it('18--StateToIdle action should set state to idle', () => {
    const action = {
      type: 'currentUser/stateToIdle',
    };
    const result = actionApplier({ status: 'some status' }, action);
    expect(result.status).toEqual('idle');
  });
  it('19--ResetPassword fulfilled action should update states with new user data', () => {
    const payloadData = {
      token: 'newToken after resetting password',
      data: {
        user: {
          _id: '6673662fbd42a966b75dec92',
          name: 'test name',
          email: 'newemail@test.com',
          role: 'patient',
          // other fields
        },
      },
    };
    const action = {
      type: 'currentUser/resetPassword/fulfilled',
      payload: payloadData,
    };
    const result = actionApplier({ status: 'some status' }, action);
    expect(result).toEqual({
      status: 'resetPassword success',
      userData: payloadData.data.user,
      token: payloadData.token,
      error: null,
    });
  });
});
