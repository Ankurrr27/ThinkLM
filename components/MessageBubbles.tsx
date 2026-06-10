import React from "react";

interface Props {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({
  role,
  content,
}: Props) {
  const isUser = role === "user";

  const parseInlineStyles = (text: string) => {
    // Regex matches [Link Text](URL)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const linkParts = text.split(linkRegex);
    
    const elements: React.ReactNode[] = [];
    
    for (let i = 0; i < linkParts.length; i++) {
      if (i % 3 === 0) {
        // Normal text segment - now parse bold **text** inside it
        const normalText = linkParts[i];
        if (normalText) {
          const boldParts = normalText.split(/\*\*(.*?)\*\*/g);
          boldParts.forEach((boldPart, boldIndex) => {
            if (boldIndex % 2 === 1) {
              elements.push(<strong key={`bold-${i}-${boldIndex}`} className="font-bold">{boldPart}</strong>);
            } else if (boldPart) {
              elements.push(boldPart);
            }
          });
        }
      } else if (i % 3 === 1) {
        // This is link text, skip rendering it directly, we will render it on index % 3 === 2
      } else if (i % 3 === 2) {
        // Render the link using the link text at index i-1 and link URL at index i
        const linkText = linkParts[i - 1];
        const linkUrl = linkParts[i];
        elements.push(
          <a
            key={`link-${i}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline font-semibold"
          >
            {linkText}
          </a>
        );
      }
    }
    
    return elements;
  };

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentBulletGroup: React.ReactNode[] = [];

    const flushBulletGroup = (key: string | number) => {
      if (currentBulletGroup.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="my-1 pl-5 list-disc space-y-1">
            {currentBulletGroup}
          </ul>
        );
        currentBulletGroup = [];
      }
    };

    lines.forEach((line, lineIndex) => {
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      
      if (isBullet) {
        const cleanLine = line.trim().substring(2);
        const parsedElements = parseInlineStyles(cleanLine);

        currentBulletGroup.push(
          <li key={lineIndex} className="list-disc">
            {parsedElements}
          </li>
        );
      } else {
        flushBulletGroup(lineIndex);

        if (!line.trim()) {
          elements.push(<div key={lineIndex} className="h-2" />);
          return;
        }

        const parsedElements = parseInlineStyles(line);

        elements.push(
          <p key={lineIndex} className="my-1">
            {parsedElements}
          </p>
        );
      }
    });

    // Flush any remaining bullets at the end
    flushBulletGroup("end");

    return elements;
  };

  return (
    <div
      className={`message-bubble ${
        isUser
          ? "message-user"
          : "message-assistant"
      }`}
    >
      {isUser ? content : <div className="space-y-1">{renderContent(content)}</div>}
    </div>
  );
}
