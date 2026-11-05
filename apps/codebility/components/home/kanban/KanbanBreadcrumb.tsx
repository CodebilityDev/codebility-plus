import { Fragment } from "react";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@codevs/ui/breadcrumb";

interface KanbanBreadcrumbItem {
  label: string;
  href: string;
}

export default function KanbanBreadcrumb({
  items,
}: {
  items: KanbanBreadcrumbItem[];
}) {
  return (
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={item.href}
                  aria-current={index === items.length - 1 ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
