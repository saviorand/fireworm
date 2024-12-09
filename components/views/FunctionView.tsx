"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Overload } from "@/lib/docs";

function FunctionView({
  name,
  overloads,
}: {
  name: string;
  overloads: Overload[] | undefined;
}) {
  return (
    <div className="py-4">
      <h3 className="text-xl font-bold mb-4">{name}</h3>
      <Accordion type="single" collapsible className="w-full">
        {overloads?.map((overload, index) => (
          <AccordionItem key={`${name}-${index}`} value={`overload-${index}`}>
            <AccordionTrigger className="text-sm">
              Overload {index + 1}: {overload.signature}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                {overload.summary && (
                  <section>
                    <h4 className="font-semibold mb-1">Summary</h4>
                    <p className="text-muted-foreground">{overload.summary}</p>
                  </section>
                )}

                {overload.description && (
                  <section>
                    <h4 className="font-semibold mb-1">Description</h4>
                    <p className="text-muted-foreground">
                      {overload.description}
                    </p>
                  </section>
                )}

                {overload.args && overload.args.length > 0 && (
                  <section>
                    <h4 className="font-semibold mb-2">Arguments</h4>
                    <div className="grid gap-2">
                      {overload.args.map((arg: any) => (
                        <div
                          key={arg.name}
                          className="flex flex-col p-2 bg-muted/30 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <code className="font-semibold">{arg.name}</code>
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                              {arg.type}
                            </code>
                            {arg.convention && (
                              <span className="text-xs text-muted-foreground">
                                ({arg.convention})
                              </span>
                            )}
                          </div>
                          {arg.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {arg.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {(overload.returnType || overload.returnsDoc) && (
                  <section>
                    <h4 className="font-semibold mb-1">Returns</h4>
                    <div className="p-2 bg-muted/30 rounded-md">
                      {overload.returnType && (
                        <code className="text-sm">{overload.returnType}</code>
                      )}
                      {overload.returnsDoc && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {overload.returnsDoc}
                        </p>
                      )}
                    </div>
                  </section>
                )}

                {overload.raises && (
                  <section>
                    <h4 className="font-semibold mb-1">Raises</h4>
                    <p className="text-sm text-muted-foreground">
                      {overload.raisesDoc || "Can raise exceptions"}
                    </p>
                  </section>
                )}

                {overload.deprecated && (
                  <section className="text-destructive">
                    <h4 className="font-semibold mb-1">Deprecated</h4>
                    <p className="text-sm">{overload.deprecated}</p>
                  </section>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default FunctionView;
