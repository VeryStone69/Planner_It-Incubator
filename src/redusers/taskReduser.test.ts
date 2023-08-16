import { TaskReducer, removeTaskAC,addTaskAC,changeStatusAC,removeTodolistAC,updateTaskAC,addTodolistAC } from "./taskReducer";

// Типизация состояния, аналогичная TasksStateType
type StateType = {
    [todolistId: string]: Array<{ id: string; title: string; isDone: boolean }>;
};

//Эти тесты проверяют различные сценарии удаления задачи из состояния
// и правильность изменения состояния после применения removeTaskAC.
describe("removeTaskAC function", () => {
    it("should remove task from the specified todolist", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
                { id: "2", title: "Task 2", isDone: true },
            ],
            todolist2: [
                { id: "3", title: "Task 3", isDone: false },
                { id: "4", title: "Task 4", isDone: true },
            ],
        };

        const action = removeTaskAC("2", "todolist1");
        const newState = TaskReducer(initialTasksState, action);

        expect(newState.todolist1).toHaveLength(1);
        expect(newState.todolist1[0].id).toBe("1");
        expect(newState.todolist2).toHaveLength(2);
    });

    it("should not modify state if task id is not found", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
                { id: "2", title: "Task 2", isDone: true },
            ],
        };

        const action = removeTaskAC("3", "todolist1"); // Task id "3" not present
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual(initialTasksState);
    });

    it("should not modify state if todolist id is not found", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
            ],
        };

        const action = removeTaskAC("1", "todolist1"); // Todolist id "todolist2" not present
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual(initialTasksState);
    });
});

//Эти тесты проверяют добавление новой задачи в разные сценарии.
describe("addTaskAC function", () => {
    it("should add a new task to the specified todolist", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false }
            ],
        };

        const action = addTaskAC("New Task", "todolist1");
        const newState = TaskReducer(initialTasksState, action);

        expect(newState.todolist1).toHaveLength(2);
        expect(newState.todolist1[0].title).toBe("New Task");
        expect(newState.todolist1[0].isDone).toBe(false);
    });

});


//Эти тесты проверяют изменение статуса задачи в различных сценариях,
// включая несуществующий ID задачи и несуществующий ID списка задач.
describe("changeStatusAC function", () => {
    it("should change the status of a task in the specified todolist", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
                { id: "2", title: "Task 2", isDone: true },
            ],
        };

        const action = changeStatusAC("2", true, "todolist1");
        const newState = TaskReducer(initialTasksState, action);

        expect(newState.todolist1[0].isDone).toBe(false);
        expect(newState.todolist1[1].isDone).toBe(true);
    });

    it("should not modify state if task id is not found", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
            ],
        };

        const action = changeStatusAC("3", true, "todolist1"); // Task id "3" not present
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual(initialTasksState);
    });

    it("should not modify state if todolist id is not found", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
            ],
        };

        const action = changeStatusAC("2", true, "todolist1"); // Todolist id "todolist2" not present
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual(initialTasksState);
    });
});


//Эти тесты проверяют удаление списка задач и связанных с ним задач в различных сценариях,
// включая несуществующий ID списка задач.
describe("removeTodolistAC function", () => {
    it("should remove the specified todolist and its tasks", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
            ],
            todolist2: [
                { id: "2", title: "Task 2", isDone: true },
            ],
        };

        const action = removeTodolistAC("todolist1");
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual({
            todolist2: [
                { id: "2", title: "Task 2", isDone: true },
            ],
        });
    });

    it("should not modify state if todolist id is not found", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
            ],
        };

        const action = removeTodolistAC("todolist2"); // Todolist id "todolist2" not present
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual(initialTasksState);
    });
});


//Эти тесты проверяют сценарии, когда указанный список задач или задача отсутствует в состоянии.
describe("updateTaskAC function", () => {
    it("should update the specified task's title", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
            ],
        };

        const action = updateTaskAC("todolist1", "1", "Updated Task 1");
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual({
            todolist1: [
                { id: "1", title: "Updated Task 1", isDone: false },
            ],
        });
    });

    it("should return the same state if the specified task does not exist in the todolist", () => {
        const initialTasksState: StateType = {
            todolist1: [
                { id: "1", title: "Task 1", isDone: false },
            ],
        };

        const action = updateTaskAC("todolist1", "nonExistentTask", "Updated Task 1");
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual(initialTasksState);
    });
});


//Эти тесты проверяют сценарии добавления нового списка задач и проверяют,
// что состояние не изменится, если указанный список уже существует.
describe("addTodolistAC function", () => {
    it("should add a new todolist with an empty task array", () => {
        const initialTasksState: StateType = {
            todolist1: [],
        };

        const action = addTodolistAC("newTodolist");
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual({
            todolist1: [],
            newTodolist: [],
        });
    });

    it("should not modify state if the todolist already exists", () => {
        const initialTasksState: StateType = {
            todolist1: [],
        };

        const action = addTodolistAC("todolist1");
        const newState = TaskReducer(initialTasksState, action);

        expect(newState).toEqual(initialTasksState);
    });
});
