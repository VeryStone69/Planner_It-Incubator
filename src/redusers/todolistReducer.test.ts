import { TodolistReduser, changeFilterAC,removeTodolistAC,updateTodolistTitleAC } from "./todolistReduser";

type TodolistType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};

type FilterValuesType = "all" | "active" | "completed";

//Эти тесты проверяют сценарии изменения фильтрации для конкретного списка задач и проверяют,
// что состояние не изменится, если указанный id списка не существует.
describe("changeFilterAC function", () => {
    it("should change filter value for a specific todolist", () => {
        const initialTodolistsState: TodolistType[] = [
            { id: "1", title: "What to learn", filter: "all" },
            { id: "2", title: "What to buy", filter: "all" },
        ];

        const action = changeFilterAC("active", "2");
        const newState = TodolistReduser(initialTodolistsState, action);

        expect(newState[0].filter).toBe("all"); // Filter for todolist with id "1" should remain unchanged
        expect(newState[1].filter).toBe("active"); // Filter for todolist with id "2" should be changed to "active"
    });

    it("should not modify state if todolist id is not found", () => {
        const initialTodolistsState: TodolistType[] = [
            { id: "1", title: "What to learn", filter: "all" },
            { id: "2", title: "What to buy", filter: "all" },
        ];

        const action = changeFilterAC("active", "3"); // Using an id that doesn't exist
        const newState = TodolistReduser(initialTodolistsState, action);

        expect(newState).toEqual(initialTodolistsState);
    });
});


// Эти тесты проверяют сценарии удаления списка задач и проверяют,
// что состояние не изменится, если указанный id списка не существует.
describe("removeTodolistAC function", () => {
    it("should remove a todolist by id", () => {
        const initialTodolistsState: TodolistType[] = [
            { id: "1", title: "What to learn", filter: "all" },
            { id: "2", title: "What to buy", filter: "all" },
        ];

        const action = removeTodolistAC("1");
        const newState = TodolistReduser(initialTodolistsState, action);

        expect(newState).toHaveLength(1); // One todolist should be removed
        expect(newState[0].id).toBe("2"); // Remaining todolist id should be "2"
    });

    it("should not modify state if todolist id is not found", () => {
        const initialTodolistsState: TodolistType[] = [
            { id: "1", title: "What to learn", filter: "all" },
            { id: "2", title: "What to buy", filter: "all" },
        ];

        const action = removeTodolistAC("3"); // Using an id that doesn't exist
        const newState = TodolistReduser(initialTodolistsState, action);

        expect(newState).toEqual(initialTodolistsState);
    });
});


//Эти тесты проверяют сценарии обновления заголовка заданного списка задач и проверяют,
// что состояние не изменится, если список с указанным id не найден.
describe("updateTodolistTitleAC function", () => {
    it("should update the title of a specific todolist", () => {
        const initialTodolistsState: TodolistType[] = [
            { id: "1", title: "What to learn", filter: "all" },
            { id: "2", title: "What to buy", filter: "all" },
        ];

        const action = updateTodolistTitleAC("1", "Updated Title");
        const newState = TodolistReduser(initialTodolistsState, action);

        expect(newState[0].title).toBe("Updated Title"); // Title of the first todolist should be updated
    });

    it("should not modify state if todolist with specified id is not found", () => {
        const initialTodolistsState: TodolistType[] = [
            { id: "1", title: "What to learn", filter: "all" },
            { id: "2", title: "What to buy", filter: "all" },
        ];

        const action = updateTodolistTitleAC("3", "Updated Title"); // Using an id that doesn't exist
        const newState = TodolistReduser(initialTodolistsState, action);

        expect(newState).toEqual(initialTodolistsState);
    });
});



