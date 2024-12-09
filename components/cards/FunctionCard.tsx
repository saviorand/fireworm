"use client";

import { Function, Overload } from "@/lib/docs";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import FunctionView from "../views/FunctionView";
import { SquareFunction } from "lucide-react";

interface FunctionCardProps {
  func: Function;
  pkg: string;
  modName: string;
}

export default function FunctionDoc({ func, pkg, modName }: FunctionCardProps) {
  const { name, overloads } = func;
  const mainOverload = overloads?.[0];

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
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {" "}
            {mainOverload?.deprecated && (
              <Badge variant="destructive">Deprecated</Badge>
            )}
          </div>
        </div>

        {(mainOverload?.args?.some((arg) => arg.description) ||
          mainOverload?.returnsDoc) && (
          <div className="mt-3 text-xs text-muted-foreground font-sans border-t pt-2">
            {mainOverload?.args?.map(
              (arg) =>
                arg.description && (
                  <div key={arg.name} className="flex gap-2 flex-wrap">
                    {" "}
                    <span className="font-mono text-primary whitespace-nowrap">
                      {arg.name}:
                    </span>
                    <span className="break-words">{arg.description}</span>
                  </div>
                ),
            )}
            {mainOverload?.returnsDoc && (
              <div className="flex gap-2 flex-wrap">
                {" "}
                <span className="font-mono whitespace-nowrap">returns:</span>
                <span className="break-words">{mainOverload.returnsDoc}</span>
              </div>
            )}
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <FunctionView name={name} overloads={overloads} />
      </DialogContent>
    </Dialog>
  );
}
