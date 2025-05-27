import React from "react";

type Task = {
  id: number;
  title: string;
  status: "todo" | "done";
};

type TaskCardProps = {
  task: Task;
  onEdit: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className={`rounded bg-white p-3 shadow flex items-center justify-between border-l-4 ${task.status === "done" ? "border-green-400" : "border-blue-400"}`}>
      <span>{task.title}</span>
      <span className={`text-xs px-2 py-1 rounded ${task.status === "done" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
        {task.status === "done" ? "完了" : "未完了"}
      </span>
    </div>
  );
};

export default TaskCard;