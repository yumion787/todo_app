import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-700 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Todoダッシュボード</h1>
      <Board />
    </main>
  );
}
