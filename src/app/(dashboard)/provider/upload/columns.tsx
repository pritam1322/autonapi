"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/Button";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { trpc } from "@/trpc-client/client";

export type API = {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  onUpdateAPI?: (api: API) => void;
  onDeleteJob?: (api: API) => void; // change this to onDeleteAPI
  onSubscribeAPI?: (api: API) => void;
};

export const columns: ColumnDef<API>[] = [
  {
    accessorKey: "name",
    header: "API Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "endpoint",
    header: "Endpoint",
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => {
      const api = row.original;
      const { data: session } = useSession();
      const { data: user } = trpc.getuser.useQuery({ id : session?.user.id! });
      return (
          <div className="flex items-center gap-2">
            {
          user && user?.role === "CONSUMER" && (
            <Button
            onClick={() => {
              api.onSubscribeAPI?.(api);
            }}
          >
            Subscribe
          </Button>
          )}
            
          </div>
        
      );
    },
  },
  {
      id: "actions",
      cell: ({ row }) => {
          const api = row.original
          const endpoint = api.endpoint;
          const { data: session } = useSession();
          const { data: user } = trpc.getuser.useQuery({ id : session?.user.id! });
      return (
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(endpoint.toString())}
              >
              Copy endpoint url
              </DropdownMenuItem>
              { user && user?.role === "PROVIDER" && (
                  <div>
                    <DropdownMenuItem
                      onClick={() => api.onUpdateAPI?.(api)} 
                    >
                    Update api
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => api.onDeleteJob?.(api)} 
                    >
                    Delete Job
                    </DropdownMenuItem>
                  </div>
              )}
              {/* { session?.user && session?.user?.role === "CONSUMER" && (
                  <div>
                    <DropdownMenuItem
                      onClick={() => api.onUpdateAPI?.(api)} 
                    >
                    
                    </DropdownMenuItem>
                  </div>
              )} */}
          </DropdownMenuContent>
          </DropdownMenu>
      )
      },
  },
  
];
