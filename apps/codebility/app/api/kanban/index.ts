import { NextResponse } from "next/server";
import { API } from "@/lib/constants";
import { UniqueIdentifier } from "@dnd-kit/core/dist/types";
import axios from "axios";

/* 

 _  __           _                      _    ____ ___ 
| |/ /__ _ _ __ | |__   __ _ _ __      / \  |  _ \_ _|
| ' // _` | '_ \| '_ \ / _` | '_ \    / _ \ | |_) | | 
| . \ (_| | | | | |_) | (_| | | | |  / ___ \|  __/| | 
|_|\_\__,_|_| |_|_.__/ \__,_|_| |_| /_/   \_\_|  |___|

*/
export const getBoards = async () => {
  try {
    const response = await axios.get(API.BOARDS, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const createBoard = async (
  data: {
    name: string;
    projects: {
      projectsId: string;
    }[];
  },
  token: string,
) => {
  try {
    const response = await axios.post(`${API.BOARDS}/create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, statusText, data: datas } = response;
    return { status, statusText, datas };
  } catch (error) {
    console.error("Error:", error);
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const createListonBoard = async (
  data: { name: string; boardId: string },
  token: string,
) => {
  try {
    const response = await axios.post(`${API.BOARDS}/list`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, statusText, data: datas } = response;
    return { status, statusText, datas };
  } catch (error) {
    console.error("Error:", error);
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const getTasks = async () => {
  try {
    const response = await axios.get(API.TASKS, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const createTask = async (data: any, token: string) => {
  try {
    const response = await axios.post(`${API.TASKS}/create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error", error);
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};
export const updateTask = async (
  data: {
    id: string;
    title: string;
    task_type: string;
    task_points: number;
    prio_level: string;
    duration: number;
    task_category: string;
    pr_link: string;
    full_description: string;
    userTaskId: {
      id: string;
    }[];
    projectId: any;
    listId: any;
  },
  token: string,
) => {
  try {
    const response = await axios.patch(`${API.TASKS}/${data.id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, statusText, data: datas } = response;
    return { status, statusText, datas };
  } catch (error) {
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const updateBoard = async (data: any, token: string) => {
  try {
    const addTodo: any = await updateTask(data, token);
    const itemId = await addTodo.data.id;

    if (!itemId) {
      throw new Error("Failed to retrieve item ID from addTodoResponse");
    }

    const newData = {
      todoOnBoard: [{ todoBoardId: itemId }],
    };
    const response = await axios.put(`${API.BOARDS}/move-todo`, newData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (e) {
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const updateBoard2 = async (
  data: {
    currentListId: string;
    newListId: string;
    todoOnBoard: {
      todoBoardId: UniqueIdentifier;
    }[];
  },
  token: string,
) => {
  try {
    const response = await axios.put(`${API.BOARDS}/move-todo`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const createTaskonList = async (
  data: {
    title: string;
    task_type: string | null;
    task_points: number;
    prio_level: string;
    duration: number;
    task_category: string | null;
    full_description: string;
    userTaskId: {
      id: string;
    }[];
    projectId: any;
    listId: any;
  },
  token: string,
  listId: string,
) => {
  try {
    const addTodo: any = await createTask(data, token);
    const itemId = await addTodo.data.id;

    if (!itemId) {
      throw new Error("Failed to retrieve item ID from addTodoResponse");
    }

    const newData = {
      listId,
      todoOnBoard: [{ todoBoardId: itemId }],
    };
    const response = await axios.put(`${API.BOARDS}/add-todo`, newData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, statusText, data: datas } = response;
    return { status, statusText, datas };
  } catch (e) {
    console.log("Error", e);
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};
