"use client";
import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { Draggable, Droppable } from "@hello-pangea/dnd";

/**
 * タスクの型定義
 * @property id - タスクの一意なID
 * @property title - タスクのタイトル
 * @property status - タスクの状態（"todo" or "done"）
 */
type Task = {
  id: number;
  title: string;
  status: "todo" | "done";
};

/**
 * Listコンポーネントのprops型
 * @property title - リストのタイトル
 * @property tasks - このリストに属するタスク配列
 * @property setTasks - タスク配列を更新する関数
 * @property listId - リストの一意なID
 * @property onEditTitle - リスト名を編集する関数
 * @property onDeleteList - リストを削除する関数
 */
type ListProps = {
  title: string;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  listId: number;
  onEditTitle: (newTitle: string) => void;
  onDeleteList: () => void;
};

/**
 * Listコンポーネント
 * 1つのリスト（カラム）を表示し、タスクの追加・編集・削除・詳細表示などを管理する
 * @param props - ListProps型。リストのタイトル、タスク配列、各種操作関数を受け取る
 */
const List: React.FC<ListProps> = ({ title, tasks, setTasks, listId, onEditTitle, onDeleteList }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [showDetail, setShowDetail] = useState(false);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [editDetailTitle, setEditDetailTitle] = useState("");
  const [editDetailMode, setEditDetailMode] = useState(false);

  /**
   * タスク編集
   * @param id - 編集対象タスクのID
   * @param newTitle - 新しいタイトル
   */
  const handleEditTask = (id: number, newTitle: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, title: newTitle } : task));
  };

  /**
   * タスク削除
   * @param id - 削除対象タスクのID
   */
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  /**
   * タスクのステータス（完了/未完了）を切り替える
   * @param id - 対象タスクのID
   */
  const handleToggleStatus = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === "done" ? "todo" : "done" }
        : task
    ));
  };

  /**
   * タスク追加
   * @param id - 編集対象タスクのID
   * @param newTitle - 新しいタイトル
   */
  const handleAddTask = () => {
    if (newTitle.trim() === "") {
      setError("タスク名を入力してください");
      return;
    }
    setTasks([
      ...tasks,
      { id: Date.now(), title: newTitle, status: "todo" }
    ]);
    setNewTitle("");
    setIsAdding(false);
    setError("");
  };

  /**
   * リスト名の編集を保存する
   */
  const handleSaveTitle = () => {
    if (editTitle.trim() === "") return;
    onEditTitle(editTitle);
    setIsEditingTitle(false);
  };

  /**
   * タスク詳細モーダルを表示する
   * @param task - 詳細表示したいタスク
   */
  const handleShowDetail = (task: Task) => {
    setDetailTask(task);
    setShowDetail(true);
    setEditDetailTitle(task.title);
    setEditDetailMode(false);
  };

  /**
   * タスク詳細モーダルでタイトル編集を保存
   */
  const handleDetailEditSave = () => {
    if (!detailTask) return;
    if (editDetailTitle.trim() === "") return;
    handleEditTask(detailTask.id, editDetailTitle);
    setDetailTask({ ...detailTask, title: editDetailTitle });
    setEditDetailMode(false);
  };

  /**
   * タスク詳細モーダルでタスクを削除
   */
  const handleDetailDelete = () => {
    if (!detailTask) return;
    handleDeleteTask(detailTask.id);
    setShowDetail(false);
  };

  /**
   * タスク詳細モーダルでステータスを切り替え
   */
  const handleDetailToggleStatus = () => {
    if (!detailTask) return;
    handleToggleStatus(detailTask.id);
    setDetailTask({ ...detailTask, status: detailTask.status === "done" ? "todo" : "done" });
  };

  /**
   * リスト削除時の確認ダイアログ
   */
  const handleDeleteListWithConfirm = () => {
    if (window.confirm("このリストを削除してもよろしいですか？")) {
      onDeleteList();
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md p-2 sm:p-4 flex flex-col min-w-[220px]">
      <div className="flex items-center mb-2 sm:mb-4 gap-2">
        {isEditingTitle ? (
          <>
            <input
              className="border rounded px-2 py-1 flex-1 text-sm sm:text-base"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSaveTitle(); }}
              autoFocus
            />
            <button className="bg-blue-400 text-white rounded px-2 py-1 text-xs sm:text-sm" onClick={handleSaveTitle}>保存</button>
            <button className="bg-gray-300 rounded px-2 py-1 text-xs sm:text-sm" onClick={() => { setIsEditingTitle(false); setEditTitle(title); }}>キャンセル</button>
          </>
        ) : (
          <>
            <h2 className="font-bold text-base sm:text-lg flex-1 truncate">{title}</h2>
            <button className="text-xs bg-gray-500 text-white rounded px-2 py-1" onClick={() => setIsEditingTitle(true)}>編集</button>
            <button className="text-xs bg-red-500 text-white rounded px-2 py-1" onClick={handleDeleteListWithConfirm}>削除</button>
          </>
        )}
      </div>
      <Droppable droppableId={listId.toString()} type="task">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-2 sm:gap-3 flex-1 min-h-[40px]"
          >
            {tasks.map((task, idx) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={idx}>
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    onClick={() => handleShowDetail(task)}
                  >
                    <TaskCard
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleStatus={handleToggleStatus}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {/* カード追加UI */}
      {isAdding ? (
        <div className="mt-2 sm:mt-4 flex flex-col gap-2">
          <input
            className="border rounded px-2 py-1 text-sm sm:text-base"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="タスク名を入力"
          />
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 text-xs sm:text-sm"
              onClick={handleAddTask}
            >
              追加
            </button>
            <button
              className="bg-gray-300 rounded px-3 py-1 text-xs sm:text-sm"
              onClick={() => { setIsAdding(false); setError(""); }}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-2 sm:mt-4 bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 text-xs sm:text-sm"
          onClick={() => setIsAdding(true)}
        >
          カードを追加
        </button>
      )}
      {/* タスク詳細モーダル */}
      {showDetail && detailTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 min-w-[220px] sm:min-w-[300px] relative">
            <h3 className="text-base sm:text-lg font-bold mb-2">タスク詳細</h3>
            {editDetailMode ? (
              <>
                <input
                  className="border rounded px-2 py-1 w-full mb-2"
                  value={editDetailTitle}
                  onChange={e => setEditDetailTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleDetailEditSave(); }}
                  autoFocus
                />
                <div className="flex gap-2 mb-2">
                  <button className="bg-blue-500 text-white rounded px-3 py-1 text-xs sm:text-sm" onClick={handleDetailEditSave}>保存</button>
                  <button className="bg-gray-300 rounded px-3 py-1 text-xs sm:text-sm" onClick={() => { setEditDetailMode(false); setEditDetailTitle(detailTask.title); }}>キャンセル</button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 text-sm sm:text-base"><span className="font-bold">タイトル：</span>{detailTask.title}</div>
                <div className="mb-4 text-sm sm:text-base"><span className="font-bold">ステータス：</span>{detailTask.status === "done" ? "完了" : "未完了"}</div>
                <div className="flex gap-2 mb-2">
                  <button className="bg-gray-500 text-white rounded px-3 py-1 text-xs sm:text-sm" onClick={() => setEditDetailMode(true)}>編集</button>
                  <button className="bg-red-500 text-white rounded px-3 py-1 text-xs sm:text-sm" onClick={handleDetailDelete}>削除</button>
                  {/* <button className="bg-lime-500 rounded px-3 py-1 text-xs sm:text-sm" onClick={handleDetailToggleStatus}>
                    {detailTask.status === "done" ? "未完了に戻す" : "完了にする"}
                  </button> */}
                  <button className={(detailTask.status === "done" ? "bg-gray-500" : "bg-green-500") + " rounded px-3 py-1 text-xs sm:text-sm text-white"} 
                      onClick={handleDetailToggleStatus}>
                    {detailTask.status === "done" ? "未完了に戻す" : "完了にする"}
                  </button>
                </div>
              </>
            )}
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg" onClick={() => setShowDetail(false)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;