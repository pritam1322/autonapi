"use client";

import { trpc } from "@/trpc-client/client";
import { useSession } from "next-auth/react";
import { API, columns } from "./columns";
import { DataTable } from "./data-table"; 
import React, { useState, useEffect } from "react";
import { UpdateAPI } from "@/components/dashboard/UpdateAPI";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateAPI } from "@/components/dashboard/CreateApi";

export default function UploadAPI() {
  const { data: session } = useSession();
  const [updateapi, setUpdateapi] = useState(false);
  const [openSubcribeAPI, setOpenSubcribeAPI] = useState(false);
  const [filteredApis, setFilteredApis] = useState<API[]>([]);
  const [apiId, setApiId] = useState("");

  const userId = session?.user?.id;
  
  // Prevent API query if userId is undefined
  const { data: apis, isLoading, error, refetch  } = trpc.getAPIs.useQuery(
    { providerId: userId! },
    { enabled: !!userId }
  );

  const deleteAPI = trpc.deleteAPI.useMutation({
    onSuccess: () => {
      refetch(); // Refresh API list after deletion
    },
  });

  useEffect(() => {
    if (!apis) return;

    const transformedAPI: API[] = apis.map((api) => ({
      id: api.id,
      name: api.name,
      description: api.description,
      endpoint: api.endpoint,
      onUpdateAPI: () => handleApiUpdate(api),
      onDeleteJob: () => handleApiDelete(api.id),
      onSubscribeAPI: () => handleApiSubscribe(api)
    }));

    console.log("Transformed APIs:", transformedAPI);
    setFilteredApis(transformedAPI);
  }, [apis]);

  const handleApiUpdate = (api: API) => {
    setUpdateapi(true);
    setApiId(api.id);
  };

  const handleApiDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this API?");
    if (!confirmed) return;

    try {
      await deleteAPI.mutateAsync({ apiId: id });
    } catch (error) {
      console.error("Error deleting API:", error);
    }
  };

  const handleApiSubscribe = async (api: API) => {
    setOpenSubcribeAPI(true);
    setApiId(api.id);
  }

  if (!userId) return <p>Loading user session...</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching APIs: {error.message}</p>;

  return (
    <section className="w-full">
      <div className="w-full px-12">
        <div className="container flex flex-col items-start gap-1 py-8 md:py-10 lg:py-12">
          <h1 className="text-2xl font-bold leading-tight tracking-tighter sm:text-3xl md:text-4xl lg:leading-[1.1]">
            Share Your API with the World
          </h1>
          <p className="max-w-2xl text-base font-light text-foreground sm:text-lg">
            Make your API accessible to developers and businesses. Define its authentication and pricing easily.
          </p>

          <div className="flex w-full items-center justify-start gap-2 pt-2">
            <CreateAPI />
          </div>
        </div>
      </div>

      <div className="w-full py-6 px-12">
        <h2 className="text-xl font-semibold mb-4">APIs</h2>
        <DataTable columns={columns} data={filteredApis} />
      </div>

      {updateapi && apiId && (
        <Dialog open={updateapi} onOpenChange={setUpdateapi}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update API</DialogTitle>
            </DialogHeader>
            <UpdateAPI apiId={apiId} setOpen={setUpdateapi} />
          </DialogContent>
        </Dialog>
      )}


    </section>
  );
}
