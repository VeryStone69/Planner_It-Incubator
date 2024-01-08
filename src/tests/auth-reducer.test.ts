import {authReducer, authThunks} from "../features/auth/model/auth-reducer";

describe('auth reducer', () => {
    let initialState = {
        isLoggedIn: false,
        captchaUrl: null
    };

    beforeEach(() => {
        initialState = {
            isLoggedIn: false,
            captchaUrl: null
        };
    });

    test('should handle initial state', () => {
        expect(authReducer(undefined, {type: 'unknown'})).toEqual({
            isLoggedIn: false,
        });
    });

    test('should handle login', () => {
        const action = authThunks.login
            .fulfilled({isLoggedIn: true}, 'requestId', {
            email: 'free@samuraijs.com',
            password: 'free',
            rememberMe: true
        });
        const endState = authReducer(initialState, action);
        expect(endState).toEqual({isLoggedIn: true});
    });

    test('should handle logout', () => {
        const action = authThunks.logout
            .fulfilled({isLoggedIn: false}, 'requestId', undefined);
        const endState = authReducer({isLoggedIn: true,captchaUrl: null}, action);
        expect(endState).toEqual({isLoggedIn: false});
    });

    test('should handle login rejected', () => {
        const action = authThunks.login.rejected(null, 'requestId', {
            email: 'free@samuraijs.com',
            password: 'wrong',
            rememberMe: false
        });
        const endState = authReducer(initialState, action);
        expect(endState).toEqual({isLoggedIn: false});
    });

    test('should handle app initialization when not logged in', () => {
        const action = authThunks.initializeApp
            .fulfilled({isLoggedIn: false}, 'requestId', undefined);
        const endState = authReducer(initialState, action);
        expect(endState).toEqual({isLoggedIn: false});
    });
});

