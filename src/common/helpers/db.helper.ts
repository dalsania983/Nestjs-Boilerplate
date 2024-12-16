import { Prisma } from '@prisma/client';
import { PaginationType } from 'src/types/module';

type T = /*unresolved*/ any;

function exclude<T extends object, Key extends keyof T>(
  table: string,
  keys: string[],
): { [P in Key]: false } {
  const model = Prisma.dmmf.datamodel.models;
  const currentModal = model.find((model) => model.name === table);
  const fields = currentModal.fields.map((field) => field.name);

  const result: Partial<Record<Key, false>> = {};
  for (const key of fields) {
    result[key] = !keys.includes(key);
  }
  return result as { [P in Key]: false };
}

function include<T extends object, Key extends keyof T>(
  table: string,
  keys: string[],
): { [P in Key]: false } {
  const model = Prisma.dmmf.datamodel.models;
  const currentModal = model.find((model) => model.name === table);
  const fields = currentModal.fields.map((field) => field.name);

  const result: Partial<Record<Key, false>> = {};
  for (const key of fields) {
    result[key] = keys.includes(key);
  }
  return result as { [P in Key]: false };
}

async function getPagination({
  page,
  pageSize,
  module,
  args = {},
}: {
  page: number | string;
  pageSize: number | string;
  module: T;
  args?: T;
}): Promise<{ data: Array<T>; pagination: PaginationType } | null> {
  const isPagination =
    typeof page !== 'undefined' && typeof pageSize !== 'undefined';

  page = Number(page ?? 0);
  pageSize = Number(pageSize ?? 0);

  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const data = await module.findMany({
    skip: isPagination ? skip : undefined,
    take: isPagination ? take : undefined,
    orderBy: {
      created_at: 'desc',
    },
    ...args,
  });
  const totalCount = await module.count({ ...args, select: undefined });
  const pagination = {
    page,
    pageSize,
    totalRecord: totalCount,
    totalPage: Math.ceil(totalCount / pageSize),
  };
  return { data, pagination: isPagination ? pagination : undefined };
}

function getSearchField(fields: string[], search: string) {
  if (!search) {
    return undefined;
  }
  return fields.map((fields) => ({ [fields]: { contains: search } }));
}

export { exclude, include, getPagination, getSearchField };
