import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 型定義
type Task = {
  id: number;
  title: string;
  status: "todo" | "done";
};

/**
 * TaskCardコンポーネントのprops型
 * @property task - 表示するタスク情報
 */
type TaskCardProps = {
  task: Task;
  onEdit: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
};

/**
 * TaskCardコンポーネント
 * 1つのタスクカード（タイトルとステータス）を表示する
 * @param props - TaskCardProps型。表示するタスク情報を受け取る
 */
const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <Card>
    <CardContent className="flex justify-between items-center">
      <span>{task.title}</span>
      <Badge className={task.status === "done" ? "bg-green-500" : "bg-gray-400"}>
        {task.status === "done" ? "完了" : "未完了"}
      </Badge>
    </CardContent>
  </Card>
  );
};

export default TaskCard;