import currentUserSliceReducer from './currentUser-slice';
import '@testing-library/jest-dom';

jest.mock('redux-persist');
describe('currentUser-slice', () => {
  it('1--Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const result = currentUserSliceReducer(initialState, action);
    console.log(result);
    expect(result).toEqual({
      token: '',
      userData: null,
      status: 'idle',
      //error: null,
    });
  });
  it('2--Should return the user,token,login success and error null state when passed  login action', () => {
    const initialState = undefined;
    const action = {
      type: 'currentUser/login/fulfilled',
      payload: {
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
      },
    };
    const result = currentUserSliceReducer(initialState, action);

    expect(result).toEqual({
      token: 'mockToken',
      userData: {
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
      status: 'login success',
      error: null,
    });
  });
  it('',()=>{
    
  })
});
