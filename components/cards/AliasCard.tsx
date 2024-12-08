"use client";

import { Alias } from "@/lib/docs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

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
        <CardTitle>
          <Link
            href={`/docs/packages/${pkg}/modules/${modName}#${name}`}
            className="font-mono text-lg font-medium hover:text-primary break-words"
          >
            {name}
          </Link>
        </CardTitle>
        {deprecated && (
          <p className="text-sm text-red-500">
            <strong>Deprecated: </strong>
            {deprecated}
          </p>
        )}
        {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong className="text-sm">Value:</strong>
          <pre className="bg-muted p-2 rounded mt-1 text-sm overflow-x-auto">
            <code>{value}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
