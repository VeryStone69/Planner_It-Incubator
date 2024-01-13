import {authReducer, authThunks} from "../features/auth/model/auth-reducer";

describe('auth reducer', () => {
    let initialState = {
        isLoggedIn: false,
        captchaUrl: ""
    };

    beforeEach(() => {
        initialState = {
            isLoggedIn: false,
            captchaUrl: ""
        };
    });

    test('should handle initial state', () => {
        expect(authReducer(undefined, {type: 'unknown'})).toEqual({
            isLoggedIn: false,
        });
    });

    test('should handle login', () => {
        const action = authThunks.login
            .fulfilled({isLoggedIn: true,captchaUrl:""}, 'requestId', {
                email: 'free@samuraijs.com',
                password: 'free',
                rememberMe: true,
                captcha: null
            });
        const endState = authReducer(initialState, action);
        expect(endState).toEqual({isLoggedIn: true});
    });

    test('should handle logout', () => {
        const action = authThunks.logout
            .fulfilled({isLoggedIn: false,captchaUrl:""}, 'requestId', undefined);
        const endState = authReducer({isLoggedIn: true, captchaUrl: ""}, action);
        expect(endState).toEqual({isLoggedIn: false});
    });

    test('should handle login rejected', () => {
        const action = authThunks.login.rejected(null, 'requestId', {
            email: 'free@samuraijs.com',
            password: 'wrong',
            rememberMe: false,
            captcha: null
        });
        const endState = authReducer(initialState, action);
        expect(endState).toEqual({isLoggedIn: false});
    });

    test('should handle app initialization when not logged in', () => {
        const action = authThunks.initializeApp
            .fulfilled({isLoggedIn: false,captchaUrl:""}, 'requestId', undefined);
        const endState = authReducer(initialState, action);
        expect(endState).toEqual({isLoggedIn: false});
    });
});

