// Boots the in-process auto-publish scheduler when the Next.js server
// starts on the Node runtime. Coolify (long-running container) is exactly
// the environment this targets. Skipped on Edge / build phase.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { startAutoPublishScheduler } = await import("./lib/autoPublishScheduler");
  startAutoPublishScheduler();
}
