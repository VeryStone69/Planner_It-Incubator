import {createSlice, isFulfilled, isPending, isRejected, PayloadAction} from "@reduxjs/toolkit";

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
                (state) => {
                    state.status = "failed"
                })
            .addMatcher(
                isFulfilled,
                (state) => {
                    state.status = "succeeded"
                })
    }
})


export const appReducer = slice.reducer;
export const appActions = slice.actions;

