import { Field, Struct } from "@/lib/docs";

type FieldProps = {
  field: Field;
};

const FieldRow = ({ field }: FieldProps) => (
  <div className="border-b last:border-b-0 border-muted-foreground/20 py-2 px-2">
    <div className="flex items-start justify-between gap-4">
      <div className="font-mono text-sm">
        <span className="text-muted-foreground">{field.name}</span>
      </div>
      <div className="font-mono text-sm text-primary ml-16">{field.type}</div>
    </div>
    {field.description && (
      <p className="text-sm text-muted-foreground mt-1 pl-4">
        {field.description}
      </p>
    )}
  </div>
);

type StructViewProps = {
  item: Struct;
};

const StructView = ({ item }: StructViewProps) => {
  const hasFields = item.fields && item.fields.length > 0;
  const hasParentTraits = item.parentTraits && item.parentTraits.length > 0;

  return (
    <div 
      id={item.name} 
      className="scroll-mt-20 p-6 bg-muted rounded-lg border border-muted-foreground/20"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h4 className="font-mono font-medium text-lg flex items-center gap-2">
            {item.name}
            {item.deprecated && (
              <span className="text-destructive text-xs font-normal">
                Deprecated
              </span>
            )}
          </h4>
          {hasParentTraits && (
            <div className="text-sm text-muted-foreground mt-1">
              implements {item.parentTraits?.join(', ') ?? ''}
            </div>
          )}
        </div>
      </div>

      {item.description && (
        <div className="mb-6 prose prose-sm max-w-none prose-neutral dark:prose-invert">
          <p>{item.description}</p>
        </div>
      )}

      {hasFields && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-sm text-muted-foreground">
              Fields ({item.fields?.length ?? 0})
            </h5>
          </div>
          <div className="w-fit bg-background rounded-md border border-muted-foreground/20">
            {item.fields?.map((field) => (
              <FieldRow key={field.name} field={field} />
            ))}
          </div>
        </div>
      )}

      {item.parameters && item.parameters.length > 0 && (
        <div className="mt-6">
          <h5 className="font-medium text-sm text-muted-foreground mb-3">
            Type Parameters
          </h5>
          <div className="bg-background rounded-md border border-muted-foreground/20">
            {item.parameters.map((param) => (
              <div 
                key={param.name}
                className="border-b last:border-b-0 border-muted-foreground/20 p-2"
              >
                <div className="font-mono text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">{param.name}</span>
                  <span className="text-primary">{param.type}</span>
                </div>
                {param.description && (
                  <p className="text-sm text-muted-foreground mt-1 pl-4">
                    {param.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {item.constraints && (
        <div className="mt-4 text-sm text-muted-foreground">
          <strong className="font-medium">Constraints:</strong> {item.constraints}
        </div>
      )}
    </div>
  );
};

const ItemSection = ({
  title,
  items,
  type
}: {
  title: string;
  items: any[];
  type: 'constants' | 'variables' | 'functions' | 'types';
}) => {
  if (items.length === 0) return null;

  const renderItem = (item: any) => {
    if (type === 'constants' || type === 'variables') {
      return (
        <div key={item.name} id={item.name} className="scroll-mt-20 p-4 bg-muted rounded-lg">
          <code className="text-sm font-mono block">
            {type === 'variables' ? 'var ' : 'const '}{item.name}{item.value && `: ${item.value}`}
          </code>
          {item.description && (
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          )}
        </div>
      );
    }

    if (type === 'functions') {
      return (
        <div key={item.name} id={item.name} className="scroll-mt-20 p-4 bg-muted rounded-lg">
          <h4 className="font-mono font-medium mb-2">{item.name}</h4>
          {item.overloads?.[0]?.signature && (
            <pre className="bg-background p-2 rounded mt-2 overflow-x-auto font-mono text-sm">
              <code>{item.overloads[0].signature}</code>
            </pre>
          )}
          {item.overloads?.[0]?.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {item.overloads[0].description}
            </p>
          )}
        </div>
      );
    }

    return <StructView key={item.name} item={item} />;
  };

  return (
    <div className="scroll-mt-20 mb-8" id={type}>
      <h3 className="text-xl font-bold mb-4">
        {title}
        <span className="text-sm font-normal text-muted-foreground ml-2">
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
      </h3>
      <div className="space-y-4">
        {items.map(renderItem)}
      </div>
    </div>
  );
};

export default ItemSection;