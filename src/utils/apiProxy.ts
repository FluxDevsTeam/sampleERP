// Local API proxy to route backend API calls to local JSON files for development
import productsData from '@/data/project-manager-page/products/products.json';
import contractorsData from '@/data/project-manager-page/products/contractors.json';
import workersData from '@/data/project-manager-page/products/salaryWorkers.json';
import projectsData from '@/data/project-manager-page/products/projects.json';
import quotationsData from '@/data/project-manager-page/products/quotations.json';

type FetchInput = string | Request;

const originalFetch = window.fetch.bind(window);

function makeResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// In-memory mutable copies
const state = {
  products: JSON.parse(JSON.stringify((productsData as any).products || [])),
  contractors: JSON.parse(JSON.stringify((contractorsData as any).contractors || [])),
  workers: JSON.parse(JSON.stringify((workersData as any).workers || [])),
  projects: JSON.parse(JSON.stringify((projectsData as any).results || [])),
  quotations: JSON.parse(JSON.stringify((quotationsData as any).quotations || [])),
};

async function handleApi(url: string, init?: RequestInit) {
  const method = (init && init.method) || 'GET';
  // Normalize
  const normalized = url.replace(/\/+/g, '/');

  // helper: parse pagination params and build paginated response
  const paginate = (allItems: any[]) => {
    let page = 1;
    let page_size = 10;
    try {
      const u = new URL(url);
      const p = u.searchParams.get('page');
      const s = u.searchParams.get('page_size') || u.searchParams.get('page-size') || u.searchParams.get('pageSize');
      if (p) page = Math.max(1, Number(p) || 1);
      if (s) page_size = Math.max(1, Number(s) || 10);
    } catch (err) {
      // url may be relative; attempt to parse query manually
      const qIndex = url.indexOf('?');
      if (qIndex >= 0) {
        const qs = new URLSearchParams(url.slice(qIndex + 1));
        const p = qs.get('page');
        const s = qs.get('page_size') || qs.get('page-size') || qs.get('pageSize');
        if (p) page = Math.max(1, Number(p) || 1);
        if (s) page_size = Math.max(1, Number(s) || 10);
      }
    }

    const total = allItems.length;
    const start = (page - 1) * page_size;
    const end = Math.min(start + page_size, total);
    const results = allItems.slice(start, end);

    // Build next/previous URLs preserving other query params if possible
    const makePageUrl = (p: number) => {
      try {
        const uu = new URL(url);
        uu.searchParams.set('page', String(p));
        uu.searchParams.set('page_size', String(page_size));
        return uu.toString();
      } catch (err) {
        // fallback: append simple params
        const base = url.split('?')[0];
        return `${base}?page=${p}&page_size=${page_size}`;
      }
    };

    const next = end < total ? makePageUrl(page + 1) : null;
    const previous = page > 1 ? makePageUrl(page - 1) : null;

    return { results, count: total, next, previous };
  };

  // Contractors list
  if (normalized.includes('/api/contractors/')) {
    if (method === 'GET') return makeResponse(paginate(state.contractors));
    // POST not implemented, return created
    return makeResponse({}, 201);
  }

  // Salary workers list
  if (normalized.includes('/api/salary-workers/')) {
    if (method === 'GET') return makeResponse(paginate(state.workers));
    return makeResponse({}, 201);
  }

  // Projects
  if (normalized.includes('/api/project/') && normalized.endsWith('/')) {
    if (method === 'GET') return makeResponse(paginate(state.projects));
  }

  // Product detail: /api/product/{id}/
  const productDetailMatch = normalized.match(/\/api\/product\/(\d+)\/?($|\?)/);
  if (productDetailMatch) {
    const id = Number(productDetailMatch[1]);
    const product = state.products.find((p: any) => p.id === id);
    if (method === 'GET') return makeResponse(product || {});
    if (method === 'PATCH') {
      try {
        const bodyText = init && init.body;
        let parsed = {} as any;
        if (bodyText instanceof FormData) {
          // convert formdata to a plain object for simple fields
          parsed = Object.fromEntries(Array.from((bodyText as FormData).entries()));
        } else if (typeof bodyText === 'string') {
          parsed = JSON.parse(bodyText);
        }
        if (product) {
          Object.assign(product, parsed);
          return makeResponse(product);
        }
        return makeResponse({}, 404);
      } catch (err) {
        return makeResponse({ error: 'Invalid body' }, 400);
      }
    }
    if (method === 'POST') {
      // creating under /api/product/{id}/ is not expected here
      return makeResponse({}, 201);
    }
  }

  // Product list: /api/product/
  if (normalized.includes('/api/product/') && !/\/api\/product\/(\d+)/.test(normalized)) {
    if (method === 'GET') return makeResponse(paginate(state.products));
    if (method === 'POST') {
      try {
        const body = init && init.body;
        let parsed: any = {};
        if (body instanceof FormData) {
          parsed = Object.fromEntries(Array.from((body as FormData).entries()));
        } else if (typeof body === 'string') parsed = JSON.parse(body);
        const newId = (state.products.reduce((max: number, p: any) => Math.max(max, p.id), 0) || 0) + 1;
        const newProduct = { id: newId, ...parsed };
        state.products.push(newProduct);
        return makeResponse(newProduct, 201);
      } catch (err) {
        return makeResponse({ error: 'Invalid body' }, 400);
      }
    }
  }

  // Add contractor to product: /api/product/{id}/contractor/
  const addContractorMatch = normalized.match(/\/api\/product\/(\d+)\/contractor\/?/);
  if (addContractorMatch) {
    const id = Number(addContractorMatch[1]);
    if (method === 'POST') {
      try {
        const bodyText = init && init.body;
        const parsed = typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText as any;
        const product = state.products.find((p: any) => p.id === id);
        if (product) {
          product.contractors = product.contractors || [];
          product.contractors.push({ contractor: parsed.contractor, cost: parsed.cost });
          return makeResponse({ success: true });
        }
        return makeResponse({}, 404);
      } catch (err) {
        return makeResponse({ error: 'Invalid body' }, 400);
      }
    }
  }

  // Add salary worker to product: /api/product/{id}/salary/
  const addSalaryMatch = normalized.match(/\/api\/product\/(\d+)\/salary\/?/);
  if (addSalaryMatch) {
    const id = Number(addSalaryMatch[1]);
    if (method === 'POST') {
      try {
        const bodyText = init && init.body;
        const parsed = typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText as any;
        const product = state.products.find((p: any) => p.id === id);
        if (product) {
          product.salary_workers = product.salary_workers || [];
          product.salary_workers.push(parsed.salary_worker);
          return makeResponse({ success: true });
        }
        return makeResponse({}, 404);
      } catch (err) {
        return makeResponse({ error: 'Invalid body' }, 400);
      }
    }
  }

  // Quotations: /api/product/{id}/quotation/
  const quotationMatch = normalized.match(/\/api\/product\/(\d+)\/quotation\/?(\d+)?\/?/);
  if (quotationMatch) {
    const id = Number(quotationMatch[1]);
    const qid = quotationMatch[2] ? Number(quotationMatch[2]) : null;
    if (method === 'POST') {
      try {
        const bodyText = init && init.body;
        const parsed = typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText as any;
        const newQid = (state.quotations.reduce((m: number, q: any) => Math.max(m, q.id || 0), 0) || 0) + 1;
        const newQuotation = { id: newQid, product: id, ...parsed };
        state.quotations.push(newQuotation);
        return makeResponse(newQuotation, 201);
      } catch (err) {
        return makeResponse({ error: 'Invalid body' }, 400);
      }
    }
    if (method === 'PATCH' && qid) {
      try {
        const bodyText = init && init.body;
        const parsed = typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText as any;
        const q = state.quotations.find((x: any) => x.id === qid && x.product === id);
        if (q) {
          Object.assign(q, parsed);
          return makeResponse(q);
        }
        return makeResponse({}, 404);
      } catch (err) {
        return makeResponse({ error: 'Invalid body' }, 400);
      }
    }
    if (method === 'GET') {
      // return quotations for this product
      return makeResponse(state.quotations.filter((x: any) => x.product === id));
    }
  }

  // Default: fall back to original fetch
  return originalFetch(url, init as any);
}

// Install global fetch proxy
(window as any).fetch = (input: FetchInput, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.url;
  if (url.includes('backend.kidsdesigncompany.com/api/')) {
    return handleApi(url, init) as any;
  }
  return originalFetch(input as any, init as any);
};

export {};
