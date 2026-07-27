import { Link } from '@inertiajs/react';
import * as React from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types/navigation';

import { useLanguage } from '@/hooks/use-language';

type Props = {
    breadcrumbs?: BreadcrumbItemType[];
};

export function Breadcrumbs({ breadcrumbs = [] }: Props) {
    const { t } = useLanguage();
    if (!breadcrumbs.length) {
        return null;
    }

    return (
        <Breadcrumb className="min-w-0">
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <React.Fragment key={`${item.title}-${index}`}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{t(item.title)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={item.href}>{t(item.title)}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
