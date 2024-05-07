import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Docs from "@/docs.json";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center pt-8 flex-col gap-8">
      <div className="text-center w-full">
        <h1 className="text-4xl font-bold">Welcome to the Docs</h1>
        <p className="text-xl mt-4">
          This is a collection of documentation for the various packages and
          modules within Basalt.
        </p>
      </div>
      <Separator className="w-2/3" />
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-16">
        {Docs.decl.packages.map((pkg) => (
          <Card className="w-full flex flex-col" key={pkg.name}>
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription className="capitalize">
                {[...pkg.modules, ...pkg.packages]
                  .map((item) => item.name)
                  .join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">{pkg.description}</CardContent>
            <div className="mt-4 p-4">
              <Button className="w-full sm:w-auto" variant="ghost">
                <Link href={`/docs/${pkg.name}`}>View Documentation</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
