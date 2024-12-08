"use client";

import { Struct, Field, Parameter, Alias } from "@/lib/docs";
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
import Link from "next/link";
import FunctionCard from "./FunctionCard";

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
  const previewCount = 3;
  const hasMore = fields.length > previewCount;
  return {
    preview: fields.slice(0, previewCount),
    remaining: fields.length - previewCount,
  };
};

export default function StructCard({ struct, pkg, modName }: StructCardProps) {
  const fieldsPreview = struct.fields ? getFieldsPreview(struct.fields) : null;

  return (
    <Card
      className="w-full hover:shadow-md transition-shadow scroll-mt-20"
      id={`${modName}-${struct.name}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={`/docs/packages/${pkg}/modules/${modName}#${struct.name}`}
              className="font-mono text-lg font-medium hover:text-primary break-words"
            >
              {struct.name}
            </Link>
            {struct.deprecated && (
              <Badge variant="destructive" className="text-xs">
                Deprecated
              </Badge>
            )}
          </div>
          <Dialog>
            <DialogTrigger className="text-sm text-muted-foreground hover:text-primary px-3 py-1 rounded-md hover:bg-muted">
              View Details
            </DialogTrigger>
            <StructDetailsContent struct={struct} pkg={pkg} modName={modName} />
          </Dialog>
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
              <div className="rounded-lg border bg-card">
                {fieldsPreview.preview.map((field) => (
                  <FieldRow key={field.name} field={field} />
                ))}
                {fieldsPreview.remaining > 0 && (
                  <Dialog>
                    <DialogTrigger className="text-sm text-primary p-2 bg-muted/50 w-full">
                      + {fieldsPreview.remaining} more fields...
                    </DialogTrigger>
                    <StructDetailsContent
                      struct={struct}
                      pkg={pkg}
                      modName={modName}
                    />
                  </Dialog>
                )}
              </div>
            </div>
          )}

          {/* Methods Section */}
          {struct.functions && struct.functions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Methods</h3>
              <div className="rounded-lg border bg-card divide-y">
                {struct.functions.map((func) => (
                  <div key={func.name} className="p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-primary">
                        {func.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 text-sm">
            {struct.parameters && struct.parameters.length > 0 && (
              <Dialog>
                <DialogTrigger>
                  <Badge variant="outline">
                    {struct.parameters.length} Parameters
                  </Badge>
                </DialogTrigger>
                <StructDetailsContent
                  struct={struct}
                  pkg={pkg}
                  modName={modName}
                />
              </Dialog>
            )}
            {struct.aliases && struct.aliases.length > 0 && (
              <Dialog>
                <DialogTrigger>
                  <Badge variant="outline">
                    {struct.aliases.length} Aliases
                  </Badge>
                </DialogTrigger>
                <StructDetailsContent
                  struct={struct}
                  pkg={pkg}
                  modName={modName}
                />
              </Dialog>
            )}
            {struct.constraints && struct.constraints.length > 0 && (
              <Dialog>
                <DialogTrigger>
                  <Badge variant="outline">Has Constraints</Badge>
                </DialogTrigger>
                <StructDetailsContent
                  struct={struct}
                  pkg={pkg}
                  modName={modName}
                />
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const StructDetailsContent = ({ struct, pkg, modName }: StructCardProps) => {
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

          <Tabs defaultValue="fields" className="w-full">
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
                <Accordion type="single" collapsible className="w-full">
                  {struct.functions.map((func, index) => (
                    <AccordionItem key={func.name} value={`function-${index}`}>
                      <AccordionTrigger className="text-sm">
                        {func.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <FunctionCard func={func} pkg={pkg} modName={modName} />
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
