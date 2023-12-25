import {AnyAction, createSlice, isAnyOf, isFulfilled, isPending, isRejected, PayloadAction} from "@reduxjs/toolkit";
import {authThunks} from "../../features/auth/model/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = ReturnType<typeof slice.getInitialState>

const slice = createSlice({
    name: "app",
    initialState: {
        status: "idle" as RequestStatusType,
        error: null as string | null,
        isInitialized: false
    },
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status;
        },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error;
        },
        setInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            isPending,
            (state) => {
                state.status = "loading"
            })
            .addMatcher(
                isRejected,
                (state, action: AnyAction) => {
                    state.status = 'failed'
                    if (action.payload) {
                        if (action.type.includes("addTodolist")) return;
                        if (action.type.includes("addTask")) return;
                        if (action.type.includes("initializeApp")) return;
                        state.error = action.payload.messages[0]
                    } else {
                        state.error = action.error.message ? action.error.message : 'Some error occurred'
                    }
                })
            .addMatcher(
                isFulfilled,
                (state) => {
                    state.status = "succeeded"
                })
            .addMatcher(
                isAnyOf(authThunks.initializeApp.fulfilled, authThunks.initializeApp.rejected),
                (state) => {
                state.isInitialized = true
            })
    }
})


export const appReducer = slice.reducer;
export const appActions = slice.actions;

