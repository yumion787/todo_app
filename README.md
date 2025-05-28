## 開発者向けメモ

- React v19
- Next.js 15.3.2
- UIコンポーネントはshadcn/uiで統一。必要なUIは `npx shadcn@latest add <component>` で追加
- ドラッグ＆ドロップは@hello-pangea/dndを利用
- 型定義やpropsにはJSDocコメントを付与
- レスポンシブはTailwindのユーティリティクラスで実装
- データは全てローカルストレージで管理（サーバー連携なし）
