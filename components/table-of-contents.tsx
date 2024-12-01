import { FunctionWithModule, StructWithModule, AliasWithModule } from "@/lib/docs";
function TableOfContents({
  constants,
  variables,
  functions,
  types,
}: {
  constants: AliasWithModule[];
  variables: AliasWithModule[];
  functions: FunctionWithModule[];
  types: StructWithModule[];
}) {
  const MAX_ITEMS_PER_SECTION = 10;

  const columns = [
    {
      title: "Functions",
      items: functions.map((f) => ({
        name: f.name,
        id: f.name,
      })),
      total: functions.length,
    },
    {
      title: "Types",
      items: types.map((t) => ({
        name: t.name,
        id: t.name,
      })),
      total: types.length,
    },
    {
      title: "Variables",
      items: variables.map((v) => ({
        name: v.name,
        id: v.name,
      })),
      total: variables.length,
    },
    {
      title: "Constants",
      items: constants.map((c) => ({
        name: c.name,
        id: c.name,
      })),
      total: constants.length,
    },
  ].filter((col) => col.items.length > 0);

  const totalItems = columns.reduce((sum, col) => sum + Math.min(col.items.length, MAX_ITEMS_PER_SECTION), 0);
  const itemsPerColumn = Math.ceil(totalItems / 3); // Aim for 3 columns max

  let currentColumn: typeof columns[0][] = [];
  let currentColumnItems = 0;
  const distributedColumns: typeof columns[] = [currentColumn];

  columns.forEach((col) => {
    const visibleItems = Math.min(col.items.length, MAX_ITEMS_PER_SECTION);
    if (currentColumnItems + visibleItems > itemsPerColumn && currentColumn.length > 0) {
      currentColumn = [];
      distributedColumns.push(currentColumn);
      currentColumnItems = 0;
    }
    currentColumn.push({
      ...col,
      items: col.items.slice(0, MAX_ITEMS_PER_SECTION),
    });
    currentColumnItems += visibleItems;
  });

  return (
    <div className="bg-muted/50 rounded-lg p-6 mb-12">
      <h2 className="text-xl font-bold mb-6">Table of Contents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {distributedColumns.map((column, colIndex) => (
          <div key={colIndex} className="space-y-6">
            {column.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-2 text-muted-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm hover:text-primary font-mono transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                  {section.total > MAX_ITEMS_PER_SECTION && (
                    <li className="text-sm text-muted-foreground">
                      and {section.total - MAX_ITEMS_PER_SECTION} more...
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

  export default TableOfContents;