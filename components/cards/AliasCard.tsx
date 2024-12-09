"use client";

import { Alias } from "@/lib/docs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { AArrowDown } from "lucide-react";

interface AliasCardProps {
  alias: Alias;
  pkg: string;
  modName: string;
}

export default function AliasCard({ alias, pkg, modName }: AliasCardProps) {
  const { name, value, summary, description, deprecated } = alias;

  return (
    <Card className="w-full" key={name} id={`${modName}-${name}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            <Link
              href={`/docs/packages/${pkg}/modules/${modName}#${name}`}
              className="font-mono text-lg font-medium hover:text-primary break-words"
            >
              <div className="flex items-center mb-1">
                <AArrowDown size={24} />
                <h3 className="font-mono text-lg font-medium hover:text-primary break-words ml-2">
                  {name}
                </h3>
              </div>
            </Link>
          </CardTitle>
          <div>
            <pre className="bg-muted p-2 rounded mt-1 text-sm max-w-lg whitespace-pre-wrap">
              <code className="break-words whitespace-pre-wrap">{value}</code>
            </pre>
          </div>
        </div>
        {deprecated && (
          <p className="text-sm text-red-500">
            <strong>Deprecated: </strong>
            {deprecated}
          </p>
        )}
        {summary && (
          <p className="text-sm text-muted-foreground break-words">{summary}</p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
    </Card>
  );
}
