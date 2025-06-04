"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeRaw]}
      components={{
        // Customize heading styles
        h1: ({ children }) => (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 mt-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-200 mb-2 mt-2">{children}</h3>
        ),
        
        // Customize paragraph styles
        p: ({ children }) => (
          <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{children}</p>
        ),
        
        // Customize list styles
        ul: ({ children }) => (
          <ul className="list-disc list-outside space-y-1 mb-3 ml-6 text-gray-700 dark:text-gray-300">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside space-y-1 mb-3 ml-6 text-gray-700 dark:text-gray-300">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-700 dark:text-gray-300 pl-1">{children}</li>
        ),
        
        // Customize code styles
        code: ({ children, ...props }) => {
          const isInline = !props.className;
          if (isInline) {
            return (
              <code className="bg-gray-100 dark:bg-gray-800 text-primary dark:text-primary-light px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          }
          return (
            <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm font-mono overflow-x-auto">
              {children}
            </code>
          );
        },
        
        // Customize pre styles (code blocks)
        pre: ({ children }) => (
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3 border">
            {children}
          </pre>
        ),
        
        // Customize blockquote styles
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary dark:border-primary-light pl-4 py-2 mb-3 bg-gray-50 dark:bg-gray-800/50 rounded-r">
            {children}
          </blockquote>
        ),
        
        // Customize table styles
        table: ({ children }) => (
          <div className="overflow-x-auto mb-3">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{children}</td>
        ),
        
        // Customize link styles
        a: ({ children, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary dark:text-primary-light hover:underline"
          >
            {children}
          </a>
        ),
        
        // Customize strong/bold styles
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
        ),
        
        // Customize emphasis/italic styles
        em: ({ children }) => (
          <em className="italic text-gray-800 dark:text-gray-200">{children}</em>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}