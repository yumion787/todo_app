"use client";
import React, { useEffect, useState } from "react";
import List from "./List";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


// ローカル
const LOCAL_STORAGE_KEY = "todo-board-lists";
// 初期リストデータ
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


/**
 * Boardコンポーネント
 * 複数のリスト（カラム）を横並びまたは縦並びで表示し、リストやタスクの追加・並び替え・編集・削除を管理する
 */
const Board: React.FC = () => {
  // リストの状態
  const [lists, setLists] = useState<ListType[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return defaultLists;
  });
  // 新規リスト名
  const [newListTitle, setNewListTitle] = useState("");
  // エラーメッセージ
  const [error, setError] = useState("");

  // listsの変更をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  /**
   * 指定リストのタスク配列を更新
   * @param listId - 対象リストのID
   * @param newTasks - 新しいタスク配列
   */
  const updateTasks = (listId: number, newTasks: Task[]) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, tasks: newTasks } : list
      )
    );
  };

  /**
   * 新しいリストを追加
   */
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

  /**
   * リスト名を編集
   * @param listId - 編集対象リストのID
   * @param newTitle - 新しいリスト名
   */
  const handleEditListTitle = (listId: number, newTitle: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );
  };

  /**
   * リストを削除
   * @param listId - 削除対象リストのID
   */
  const handleDeleteList = (listId: number) => {
    setLists((prev) => prev.filter((list) => list.id !== listId));
  };

  /**
   * ドラッグ＆ドロップ完了時の処理
   * @param result - ドラッグ操作の結果情報
   */
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
            <Card className="w-full max-w-xs sm:w-72 min-w-0 sm:min-w-[260px]">
              <CardContent>
                <Input placeholder="新しいリスト名" value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} />
                {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
                <Button className="w-full mt-2 sm:mt-4 bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 text-xs sm:text-sm" onClick={handleAddList}>リストを追加</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board; 