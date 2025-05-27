"use client";
import React, { useEffect, useState } from "react";
import List from "./List";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const LOCAL_STORAGE_KEY = "todo-board-lists";

const defaultLists = [
  {
    id: 1,
    title: "スプリント1(1/21～2/3)",
    tasks: [
      { id: 1, title: "サインアップ機能", status: "todo" },
      { id: 2, title: "ログイン機能", status: "done" },
    ],
  },
  {
    id: 2,
    title: "スプリント2(2/4～2/17)",
    tasks: [
      { id: 3, title: "ログ表示機能", status: "todo" },
      { id: 4, title: "Twitter投稿機能", status: "todo" },
    ],
  },
  // ...他のリスト...
];

// 型定義
interface Task {
  id: number;
  title: string;
  status: "todo" | "done";
}
interface ListType {
  id: number;
  title: string;
  tasks: Task[];
}

const Board: React.FC = () => {
  const [lists, setLists] = useState<ListType[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return defaultLists;
  });
  const [newListTitle, setNewListTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  // Listのtasksを更新するための関数
  const updateTasks = (listId: number, newTasks: Task[]) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, tasks: newTasks } : list
      )
    );
  };

  // リスト追加
  const handleAddList = () => {
    if (newListTitle.trim() === "") {
      setError("リスト名を入力してください");
      return;
    }
    setLists((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newListTitle,
        tasks: [],
      },
    ]);
    setNewListTitle("");
    setError("");
  };

  // リスト名編集
  const handleEditListTitle = (listId: number, newTitle: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );
  };

  // リスト削除
  const handleDeleteList = (listId: number) => {
    setLists((prev) => prev.filter((list) => list.id !== listId));
  };

  // ドラッグ＆ドロップの処理
  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (type === "list") {
      // リスト自体の並び替え
      const newLists = Array.from(lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);
      setLists(newLists);
      return;
    }
    // タスクの並び替え・リスト間移動
    if (source.droppableId === destination.droppableId) {
      const listIdx = lists.findIndex((l) => l.id.toString() === source.droppableId);
      if (listIdx === -1) return;
      const newTasks = Array.from(lists[listIdx].tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);
      updateTasks(lists[listIdx].id, newTasks);
    } else {
      const sourceIdx = lists.findIndex((l) => l.id.toString() === source.droppableId);
      const destIdx = lists.findIndex((l) => l.id.toString() === destination.droppableId);
      if (sourceIdx === -1 || destIdx === -1) return;
      const sourceTasks = Array.from(lists[sourceIdx].tasks);
      const destTasks = Array.from(lists[destIdx].tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);
      updateTasks(lists[sourceIdx].id, sourceTasks);
      updateTasks(lists[destIdx].id, destTasks);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-lists" direction="horizontal" type="list">
        {(provided) => (
          <div
            className="flex flex-col items-center sm:flex-row sm:items-stretch gap-6 sm:overflow-x-auto w-full min-w-0 p-4 min-h-[80vh]"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {lists.map((list, idx) => (
              <Draggable draggableId={list.id.toString()} index={idx} key={list.id}>
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <div className="bg-gray-100 rounded-lg shadow-md w-full max-w-xs sm:w-72 min-w-0 sm:min-w-[260px] p-2 sm:p-4 flex flex-col">
                      <List
                        title={list.title}
                        tasks={list.tasks}
                        setTasks={(newTasks: Task[]) => updateTasks(list.id, newTasks)}
                        listId={list.id}
                        onEditTitle={(newTitle: string) => handleEditListTitle(list.id, newTitle)}
                        onDeleteList={() => handleDeleteList(list.id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {/* リスト追加UI */}
            <div className="bg-white rounded-lg shadow-md w-full sm:w-72 min-w-0 sm:min-w-[260px] max-w-xs p-2 sm:p-4 flex flex-col justify-center items-center h-[15vh]">
              <input
                className="border rounded px-2 py-1 w-full mb-2"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="新しいリスト名"
              />
              {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
              <button
                className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 w-full"
                onClick={handleAddList}
              >
                リストを追加
              </button>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board; 