"use client";

import { Function, Overload } from "@/lib/docs";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import FunctionView from "../views/FunctionView";
import { SquareFunction } from "lucide-react";
import React from "react";

interface FunctionCardProps {
  func: Function;
  pkg: string;
  modName: string;
}

export default function FunctionDoc({ func, pkg, modName }: FunctionCardProps) {
  const { name, overloads } = func;
  const mainOverload = overloads?.[0];

  const hasDescriptions =
    mainOverload?.args?.some((arg) => arg.description) ||
    mainOverload?.returnsDoc;

  return (
    <Dialog>
      <DialogTrigger className="w-full border rounded-lg p-3 sm:p-4 hover:border-primary/50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-1">
              <SquareFunction size={24} />
              <h3 className="text-lg font-mono ml-2">{name}</h3>
            </div>
            <div className="font-mono mt-2 text-sm text-muted-foreground overflow-x-auto scrollbar-none">
              {!hasDescriptions ? (
                <div className="flex flex-col md:flex-row md:items-center flex-wrap">
                  <div className="flex flex-wrap items-center gap-1">
                    {mainOverload?.args?.map((arg, index, array) => (
                      <span key={arg.name} className="break-words text-left">
                        <span className="text-primary">{arg.name}</span>
                        <span className="text-muted-foreground mx-1">:</span>
                        <span className="text-foreground break-words">
                          {arg.type}
                        </span>
                        {index < array.length - 1 && (
                          <span className="text-muted-foreground mr-1">,</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="mx-2">{"->"}</span>
                  <span className="text-foreground break-all">
                    {mainOverload?.returnType}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-x-4">
                  {mainOverload?.args?.map((arg) => (
                    <div
                      key={arg.name}
                      className="col-span-12 border-b py-2 first:pt-0"
                    >
                      <div className="grid grid-cols-12 gap-x-4">
                        <span className="col-span-8 break-words text-left">
                          <span className="text-primary">{arg.name}</span>
                          <span className="text-muted-foreground mx-1">:</span>
                          <span className="text-foreground break-words">
                            {arg.type}
                          </span>
                        </span>
                        {arg.description && (
                          <span className="col-span-4 break-words text-xs text-left text-muted-foreground font-sans">
                            {arg.description}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="col-span-12 border-b py-2 last:border-b-0">
                    <div className="grid grid-cols-12 gap-x-4">
                      <span className="col-span-8 break-words text-left">
                        <span className="text-muted-foreground mr-1">
                          returns
                        </span>
                        <span className="text-muted-foreground mx-1">:</span>
                        <span className="text-foreground break-words">
                          {mainOverload?.returnType}
                        </span>
                      </span>
                      {mainOverload?.returnsDoc && (
                        <span className="col-span-4 break-words text-xs text-left text-muted-foreground font-sans">
                          {mainOverload.returnsDoc}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {mainOverload?.deprecated && (
              <Badge variant="destructive">Deprecated</Badge>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <FunctionView name={name} overloads={overloads} />
      </DialogContent>
    </Dialog>
  );
}
