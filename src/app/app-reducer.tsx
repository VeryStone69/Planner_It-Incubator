export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
export type SetInitializedActionType = ReturnType<typeof setInitializedAC>

type ActionsType = SetAppStatusType | SetAppErrorType| SetInitializedActionType

const initialState = {
    status: 'loading' as RequestStatusType,
    error: "Error message" as null | string,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.status}
        }
        case 'APP/SET-ERROR': {
            return {...state, error: action.error}
        }
        case 'APP/SET-INITIALISED': {
            return {...state, isInitialized: action.isInitialized}
        }
        default:
            return state
    }
}


export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)
export const setInitializedAC = (isInitialized: boolean) => ({type: 'APP/SET-INITIALISED', isInitialized} as const)
