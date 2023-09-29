import {tasksReducer} from '../redusers/taskReducer';
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import {todolistsReducer} from "../redusers/todolistReduser";
import thunk,{ThunkDispatch} from "redux-thunk"
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})
// непосредственно создаём store
export const store =legacy_createStore(rootReducer,applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type ThunkType = ThunkDispatch<AppRootStateType,any,AnyAction>;

//Кастомный хук, чтобы не "тоскать" по всему приложению типизацию.
export const useAppDispatch=useDispatch<ThunkType>
export const useAppSelector:TypedUseSelectorHook<AppRootStateType>=useSelector;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
