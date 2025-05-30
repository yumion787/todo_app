import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Todoダッシュボード
      </h1>
      <Board />
    </main>
  );
}
