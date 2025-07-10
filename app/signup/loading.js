import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 dark:bg-black dark:bg-opacity-70 z-50">
      <LoadingSpinner />
    </div>
  );
}