export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
      <main className="max-w-xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          AUMS Enterprise Portal
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Welcome to the AI Powered Autonomous Management System (AUMS) Enterprise University ERP.
        </p>
        <div className="flex gap-4">
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
            System Operational
          </span>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20">
            V1 API Standardized
          </span>
        </div>
      </main>
    </div>
  );
}
