"use client";

import { trpc } from "@/trpc-client/client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { API, createColumns } from "../../provider/upload/columns";
import { DataTable } from "../../provider/upload/data-table";

export default function UploadAPI() {
  const { data: session } = useSession();
  const userId = session?.user?.id || undefined;
  const [filteredApis, setFilteredApis] = useState<API[]>([]);
  // Fetch APIs using tRPC
  const { data: apis, isLoading, error } = trpc.getAPIs.useQuery({});
  const { data: user } = trpc.getuser.useQuery(
    { id: session?.user?.id ?? "" }, // Provide a fallback empty string or undefined
    { enabled: !!session?.user?.id } // Prevents execution if `session?.user.id` is undefined
  );
  
  
  const columns = createColumns(user?.role!);

  useEffect(() => {
    if (!apis) return;

    setFilteredApis(
      apis.map((api: API) => ({
        id: api.id,
        name: api.name,
        description: api.description,
        endpoint: api.endpoint,
        authType: api.authType,
        pricePerRequest: api.pricePerRequest,
      }))
    );
  }, [apis]);


  if(!userId) return <div className="text-center text-gray-500">User not found</div>
  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">
        Error fetching APIs: {error.message}
      </p>
    );

  return (
    <section className="w-full">
      {/* Heading & Subheading */}
      <div className="container flex flex-col items-start gap-1 pt-8 md:py-10 lg:pt-12">
        <h1 className="text-2xl font-bold leading-tight tracking-tighter sm:text-3xl md:text-4xl lg:leading-[1.1]">
          Manage Your APIs
        </h1>
        <p className="max-w-2xl text-base font-light text-foreground sm:text-lg">
          View, update, and manage your APIs in one place. Easily share them with developers.
        </p>
      </div>

      {/* Data Table */}
      <div className="py-6">
        <DataTable columns={columns} data={filteredApis || []} />
      </div>
      
    </section>
  );
}
