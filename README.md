## デモサイト
https://todo-4knmqukrv-yumions-projects.vercel.app/
![scr-todo-app](https://github.com/user-attachments/assets/22467c48-3d67-42cf-b2fb-fc89922c2185)


---
## プロジェクト概要
### プロジェクト
Trello風のタスク管理Webアプリ  
### 仕様
リスト（スプリント/カラム）を作成し、各リスト内でタスク（カード）の追加・編集・削除・完了管理が可能  
### 見た目・使用
#### 実用的かつモダンなUI/UX  
- ドラッグ＆ドロップによるリスト・タスクの並び替えや移動  
- ローカルストレージによるデータ永続化  
- スマホ・PC両対応のレスポンシブデザイン  

## 使用技術スタック
### フロントエンド
Next.js TypeScript React 19
### UI/スタイリング
Tailwind CSS / shadcn/ui（UIコンポーネントライブラリ）
### ドラッグ＆ドロップ
@hello-pangea/dnd
### データ管理
ローカルストレージ（ブラウザ保存）
### その他
JSDocコメントによる型・propsの明示 / レスポンシブ対応（Tailwindのユーティリティクラス）

## 設計ポリシー
### UI/UX重視
- shadcn/uiとTailwind CSSを活用し、シンプルかつ洗練されたデザインを実現
- スマホ・タブレット・PCで快適に使えるレスポンシブ設計
- ドラッグ＆ドロップで直感的な操作性
### 拡張性・保守性
- 型定義やpropsにはJSDocコメントを付与し、型安全性を担保
- UIコンポーネントはshadcn/uiで統一し、再利用性を高める
- データは全てローカルストレージで管理し、サーバー連携なしでも動作
### 開発効率
- 必要なUIは npx shadcn@latest add <component> で追加
- ディレクトリ構成は src/app（ページ・レイアウト）、src/components（UIコンポーネント）で整理
### シンプルなデータ管理
- サーバーやDBを使わず、ローカルストレージのみで完結
- リロードしてもデータが保持される
