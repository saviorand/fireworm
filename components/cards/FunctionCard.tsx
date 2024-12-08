"use client";

import { Function } from "@/lib/docs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";

interface FunctionCardProps {
  func: Function;
  pkg: string;
  modName: string;
}

export default function FunctionCard({
  func,
  pkg,
  modName,
}: FunctionCardProps) {
  const { name, overloads } = func;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link
            href={`/docs/packages/${pkg}/modules/${modName}#${name}`}
            className="font-mono text-lg font-medium hover:text-primary break-words"
          >
            {name}
          </Link>
          <Dialog>
            <DialogTrigger className="text-sm text-muted-foreground hover:text-primary">
              View Details
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="py-4">
                <h3 className="text-xl font-bold mb-4">{name}</h3>
                <Accordion type="single" collapsible className="w-full">
                  {overloads?.map((overload, index) => (
                    <AccordionItem
                      key={`${name}-${index}`}
                      value={`overload-${index}`}
                    >
                      <AccordionTrigger className="text-sm">
                        Overload {index + 1}: {overload.signature}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-sm">
                          {overload.summary && (
                            <div>
                              <strong>Summary:</strong>
                              <p className="mt-1">{overload.summary}</p>
                            </div>
                          )}

                          {overload.description && (
                            <div>
                              <strong>Description:</strong>
                              <p className="mt-1">{overload.description}</p>
                            </div>
                          )}

                          {overload.args && overload.args.length > 0 && (
                            <div>
                              <strong>Arguments:</strong>
                              <ul className="mt-1 list-disc pl-4">
                                {overload.args.map((arg) => (
                                  <li key={arg.name}>
                                    <code>{arg.name}</code>: {arg.type}
                                    {arg.description && ` - ${arg.description}`}
                                    {arg.convention && ` (${arg.convention})`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {overload.returnType && (
                            <div>
                              <strong>Return Type:</strong>
                              <p className="mt-1">
                                <code>{overload.returnType}</code>
                              </p>
                            </div>
                          )}

                          {overload.returnsDoc && (
                            <div>
                              <strong>Returns:</strong>
                              <p className="mt-1">{overload.returnsDoc}</p>
                            </div>
                          )}

                          {overload.deprecated && (
                            <div className="text-red-500">
                              <strong>Deprecated:</strong>
                              <p className="mt-1">{overload.deprecated}</p>
                            </div>
                          )}

                          {overload.raises && (
                            <div>
                              <strong>Raises:</strong>
                              <p className="mt-1">
                                {overload.raisesDoc || "Can raise exceptions"}
                              </p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        {overloads?.[0]?.summary && (
          <p className="text-sm text-muted-foreground">
            {overloads[0].summary}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
          <code>{overloads?.[0]?.signature}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
