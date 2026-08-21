export const normalizePage = (payload) => {
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length, page: 1, size: payload.length, pages: 1 };
  }

  const source = payload || {};
  const items = source.records ?? source.content ?? source.items ?? source.data ?? [];
  return {
    items: Array.isArray(items) ? items : [],
    total: Number(source.total ?? source.totalElements ?? source.totalHit ?? items.length ?? 0),
    page: Number(source.current ?? source.page ?? source.number ?? 1),
    size: Number(source.size ?? source.pageSize ?? items.length ?? 0),
    pages: Number(source.pages ?? source.totalPages ?? 1),
  };
};

export const normalizeList = (payload) => normalizePage(payload).items;
