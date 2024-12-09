import { Trait } from "@/lib/docs";
import { Puzzle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export type TraitCardProps = {
  trait: Trait;
  pkg: string;
  modName: string;
};

export default function TraitCard({ trait, pkg, modName }: TraitCardProps) {
  return (
    <Card
      className="hover:shadow-md transition-shadow scroll-mt-20"
      id={`${modName}-${trait.name}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center mb-1">
              <Puzzle size={24} />{" "}
              {/* Using a different icon to distinguish from Struct */}
              <h3 className="font-mono text-lg font-medium hover:text-primary break-words ml-2">
                {trait.name}
              </h3>
            </div>
            {trait.deprecated && (
              <Badge variant="destructive" className="text-xs">
                Deprecated
              </Badge>
            )}
          </div>
        </CardTitle>
        {trait.summary && (
          <p className="text-sm text-muted-foreground">{trait.summary}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Parent Traits Section */}
          {trait.parentTraits && trait.parentTraits.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Extends:</span>{" "}
              <span className="text-primary">
                {trait.parentTraits.join(", ")}
              </span>
            </div>
          )}

          {/* Functions Section */}
          {trait.functions && trait.functions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Methods</h3>
              <div className="flex rounded-lg border bg-card divide-y flex-wrap">
                {trait.functions.map((func) => (
                  <div key={func.name} className="p-2 hover:bg-muted/50">
                    <span className="font-mono text-sm text-primary">
                      {func.name}
                    </span>
                    {func.overloads && func.overloads.length > 1 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {func.overloads.length} overloads
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          {trait.description && (
            <div className="text-sm text-muted-foreground">
              <p>{trait.description}</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 text-sm">
            {trait.functions && trait.functions.length > 0 && (
              <Badge variant="outline">{trait.functions.length} Methods</Badge>
            )}
            {trait.parentTraits && trait.parentTraits.length > 0 && (
              <Badge variant="outline">
                {trait.parentTraits.length} Parent Traits
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
