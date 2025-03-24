"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export type API = {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  authType: string;
  pricePerRequest: number | null;
  onUpdateAPI?: (api: API) => void;
  onDeleteAPI?: (api: API) => void; // Fixed: renamed onDeleteJob → onDeleteAPI
  onSubscribeAPI?: (api: API) => void;
};

// Function to generate columns (accepts user data as a parameter)
export const createColumns = (userRole: string | null) => {
  const columns: ColumnDef<API>[] = [
    {
      accessorKey: "name",
      header: "API Name",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return <div className="w-72 text-wrap">{row.getValue("description")}</div>;
      },
    },
    {
      accessorKey: "authType",
      header: "Auth Type",
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue("authType")}</div>;
      },
    },
    {
      accessorKey: "endpoint",
      header: "Endpoint",
    },
    {
      accessorKey: "pricePerRequest",
      header: "Price Per Request",
      cell: ({ row }) => {
        return <div className="text-center mr-2">$ {row.getValue("pricePerRequest")}</div>;
      },
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }) => {
        const api = row.original;

        return (
          <div className="flex items-center gap-2">
            {userRole === "CONSUMER" && (
              <Button onClick={() => api.onSubscribeAPI?.(api)}>Subscribe</Button>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const api = row.original;
        const endpoint = api.endpoint;

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
                Copy endpoint URL
              </DropdownMenuItem>
              {userRole === "PROVIDER" && (
                <>
                  <DropdownMenuItem onClick={() => api.onUpdateAPI?.(api)}>
                    Update API
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => api.onDeleteAPI?.(api)}>
                    Delete API
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
