import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BiografCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
}

export default function BiografCard({
  title,
  description,
  footer,
  className,
  headerClassName,
  contentClassName,
  children,
  ...props
}: BiografCardProps) {
  return (
    <Card
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <CardHeader className={cn("pb-2", headerClassName)}>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      )}
      <CardContent
        className={cn(
          !title && !description ? "p-4" : "pt-0",
          contentClassName
        )}
      >
        {children}
      </CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}
