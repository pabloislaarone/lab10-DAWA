import PortalLoader from "@/components/rickandmorty/PortalLoader";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <PortalLoader />
    </div>
  );
}
