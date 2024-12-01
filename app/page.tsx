import docsConfig from '@/docs.config.json'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import * as emoji from 'node-emoji'
import fs from 'fs';
import path from 'path';

export default async function Home() {
  const readmePath = path.join(process.cwd(), 'public', 'readme.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const contentWithEmojis = emoji.emojify(readmeContent);

  return (
    <main className="flex items-center justify-center pt-12 flex-col">
      <div className="text-center w-full">
        <h1 className="text-4xl font-bold">{docsConfig.welcomeMessage}</h1>
        <p className="text-xl mt-6 -mb-6 max-w-2xl mx-auto text-muted-foreground">
          {docsConfig.longDescription}
        </p>
      </div>
      <div className="w-2/3 prose prose-slate dark:prose-invert max-w-none mb-12">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }: { node?: any, inline?: boolean, className?: string, children?: React.ReactNode }) {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : ''

              const effectiveLanguage = language === 'toml' ? 'text' : language

              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={effectiveLanguage}
                  PreTag="div"
                  {...props}
                  customStyle={{
                    whiteSpace: 'pre',
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {contentWithEmojis}
        </ReactMarkdown>
      </div>
    </main>
  );
}
