"use client";

import { Struct, Field, Function } from "@/lib/docs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FunctionView from "../views/FunctionView";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Cuboid } from "lucide-react";

interface StructCardProps {
  struct: Struct;
  pkg: string;
  modName: string;
}

type FieldProps = {
  field: Field;
};

const FieldRow = ({ field }: FieldProps) => (
  <div className="border-b last:border-b-0 border-muted-foreground/20 py-2 px-2">
    <div className="flex flex-wrap sm:justify-between items-start gap-4">
      <div className="font-mono text-sm">
        <span className="text-muted-foreground">{field.name}</span>
      </div>
      <div className="font-mono text-sm text-primary break-all">
        {field.type}
      </div>
    </div>
    {field.description && (
      <p className="text-sm text-muted-foreground mt-1 pl-4">
        {field.description}
      </p>
    )}
  </div>
);

const getFieldsPreview = (fields: Field[]) => {
  const previewCount = 10;
  const hasMore = fields.length > previewCount;
  return {
    preview: fields.slice(0, previewCount),
    remaining: fields.length - previewCount,
  };
};

export default function StructCard({ struct, pkg, modName }: StructCardProps) {
  const fieldsPreview =
    struct.fields && struct.fields.length > 0
      ? getFieldsPreview(struct.fields)
      : null;

  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<Function | null>(
    null,
  );
  const handleDialogOpenChange = (open: boolean) => {
    setIsMainDialogOpen(open);
    if (!open) {
      setSelectedFunction(null);
    }
  };

  return (
    <Dialog open={isMainDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Card
          className="hover:shadow-md transition-shadow scroll-mt-20 cursor-pointer"
          id={`${modName}-${struct.name}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center mb-1">
                  <Cuboid size={24} />
                  <h3 className="font-mono text-lg font-medium hover:text-primary break-words ml-2">
                    {" "}
                    {struct.name}
                  </h3>
                </div>
                {struct.deprecated && (
                  <Badge variant="destructive" className="text-xs">
                    Deprecated
                  </Badge>
                )}
              </div>
            </CardTitle>
            {struct.summary && (
              <p className="text-sm text-muted-foreground">{struct.summary}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quick Info Section */}
              {struct.parentTraits && struct.parentTraits.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Implements:</span>{" "}
                  <span className="text-primary">
                    {struct.parentTraits.join(", ")}
                  </span>
                </div>
              )}

              {/* Fields Section */}
              {fieldsPreview && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Fields</h3>
                  <div className="rounded-lg border bg-card max-w-lg overflow-x-auto">
                    {fieldsPreview.preview.map((field) => (
                      <div
                        key={field.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMainDialogOpen(true);
                        }}
                      >
                        <FieldRow field={field} />
                      </div>
                    ))}
                    {fieldsPreview.remaining > 0 && (
                      <div className="text-sm text-primary p-2 bg-muted/50 w-full">
                        + {fieldsPreview.remaining} more fields...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Methods Section */}
              {struct.functions && struct.functions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Methods</h3>
                  <div className="flex rounded-lg border bg-card divide-y flex-wrap">
                    {struct.functions.map((func) => (
                      <div
                        key={func.name}
                        className="p-2 hover:bg-muted/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFunction(func);
                          setIsMainDialogOpen(true);
                        }}
                      >
                        <span className="font-mono text-sm text-primary">
                          {func.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 text-sm">
                {struct.parameters && struct.parameters.length > 0 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMainDialogOpen(true);
                    }}
                  >
                    <Badge variant="outline">
                      {struct.parameters.length} Parameters
                    </Badge>
                  </div>
                )}
                {struct.aliases && struct.aliases.length > 0 && (
                  <Badge variant="outline">
                    {struct.aliases.length} Aliases
                  </Badge>
                )}
                {struct.constraints && struct.constraints.length > 0 && (
                  <Badge variant="outline">Has Constraints</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <StructDetailsContent
          struct={struct}
          pkg={pkg}
          modName={modName}
          selectedFunction={selectedFunction}
          onClose={() => setSelectedFunction(null)}
        />
      </DialogContent>
    </Dialog>
  );
}

const StructDetailsContent = ({
  struct,
  defaultTab = "fields",
  selectedFunction,
  onClose,
}: StructCardProps & {
  defaultTab?: string;
  selectedFunction: Function | null;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState(
    selectedFunction ? "functions" : defaultTab,
  );

  useEffect(() => {
    if (selectedFunction) {
      setActiveTab("functions");
      // Wait for DOM update before scrolling
      setTimeout(() => {
        const functionElement = document.getElementById(
          `function-${selectedFunction.name}`,
        );
        if (functionElement) {
          functionElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      setActiveTab(defaultTab);
    }
  }, [selectedFunction, defaultTab]);

  return (
    <>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="py-4">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-bold">{struct.name}</h3>
            {struct.deprecated && (
              <span className="text-red-500 text-sm">Deprecated</span>
            )}
          </div>

          {struct.parentTraits && struct.parentTraits.length > 0 && (
            <div className="mb-4">
              <strong>Implements:</strong>{" "}
              <span className="text-primary">
                {struct.parentTraits.join(", ")}
              </span>
            </div>
          )}

          {struct.description && (
            <div className="mb-6">
              <p className="text-muted-foreground">{struct.description}</p>
            </div>
          )}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList>
              {struct.fields && struct.fields.length > 0 && (
                <TabsTrigger value="fields">Fields</TabsTrigger>
              )}
              {struct.functions && struct.functions.length > 0 && (
                <TabsTrigger value="functions">Functions</TabsTrigger>
              )}
              {struct.parameters && struct.parameters.length > 0 && (
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
              )}
              {struct.aliases && struct.aliases.length > 0 && (
                <TabsTrigger value="aliases">Aliases</TabsTrigger>
              )}
            </TabsList>

            {struct.fields && (
              <TabsContent value="fields">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {struct.fields.map((field) => (
                        <tr key={field.name} className="border-b last:border-0">
                          <td className="p-2 font-mono">{field.name}</td>
                          <td className="p-2 font-mono text-primary">
                            {field.type}
                          </td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {field.description || field.summary}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            )}

            {struct.functions && (
              <TabsContent value="functions">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  defaultValue={
                    selectedFunction
                      ? `function-${selectedFunction.name}`
                      : undefined
                  }
                >
                  {struct.functions.map((func, index) => (
                    <AccordionItem
                      key={func.name}
                      value={`function-${func.name}`}
                      id={`function-${func.name}`}
                    >
                      <AccordionTrigger
                        className={cn(
                          "text-sm",
                          selectedFunction?.name === func.name &&
                            "text-primary",
                        )}
                      >
                        {func.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <FunctionView
                          name={func.name}
                          overloads={func.overloads}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            )}

            {struct.parameters && (
              <TabsContent value="parameters">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {struct.parameters.map((param) => (
                        <tr key={param.name} className="border-b last:border-0">
                          <td className="p-2 font-mono">{param.name}</td>
                          <td className="p-2 font-mono text-primary">
                            {param.type}
                          </td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {param.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            )}

            {struct.aliases && (
              <TabsContent value="aliases">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Value</th>
                        <th className="p-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {struct.aliases.map((alias) => (
                        <tr key={alias.name} className="border-b last:border-0">
                          <td className="p-2 font-mono">{alias.name}</td>
                          <td className="p-2 font-mono text-primary">
                            {alias.value}
                          </td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {alias.description || alias.summary}
                            {alias.deprecated && (
                              <span className="text-red-500 ml-2">
                                (Deprecated)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            )}
          </Tabs>

          {struct.constraints && (
            <div className="mt-6">
              <strong>Constraints:</strong>
              <p className="mt-1 text-muted-foreground">{struct.constraints}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </>
  );
};
