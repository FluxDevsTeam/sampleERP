import workersSummaryData from "../data/admin/workers/workersSummary.json";
import salaryWorkersData from "../data/admin/workers/salaryWorkers.json";
import contractorsData from "../data/admin/workers/contractors.json";
import salaryWorkerRecordsData from "../data/admin/workers/salaryWorkerRecords.json";
import contractorRecordsData from "../data/admin/workers/contractorRecords.json";
import workerDetailsData from "../data/admin/workers/workerDetails.json";

export interface WorkersSummary {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    salary_workers_count: number;
    active_salary_workers_count: number;
    total_salary_workers_monthly_pay: number;
    total_paid: number;
    all_contractors_count: number;
    all_active_contractors_count: number;
    total_contractors_monthly_pay: number;
    total_contractors_weekly_pay: number;
  };
}

export interface SalaryWorker {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  address?: string;
  craft_specialty?: string;
  years_of_experience?: number;
  position?: string;
  salary: number;
  is_still_active: boolean;
  date_joined: string;
  date_left?: string | null;
  guarantor_name?: string | null;
  guarantor_phone_number?: string | null;
  guarantor_address?: string | null;
  image?: string | null;
  agreement_form_image?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface Contractor {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  address?: string;
  craft_specialty?: string;
  years_of_experience?: number;
  contract_value: number;
  contract_type: string;
  is_still_active: boolean;
  date_joined: string;
  date_left?: string | null;
  guarantor_name?: string | null;
  guarantor_phone_number?: string | null;
  guarantor_address?: string | null;
  image?: string | null;
  agreement_form_image?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface PaginatedSalaryWorkersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { workers: SalaryWorker[] };
}

export interface PaginatedContractorsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { contractor: Contractor[] };
}

export interface ContractorRecord {
  id: number;
  report: string;
  date: string;
  worker: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface PaginatedRecordsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ContractorRecord[];
}

// Exported functions matching apiService.tsx imports
export const getWorkersSummary = async (): Promise<WorkersSummary> => {
  return workersSummaryData as WorkersSummary;
};

export const getSalaryWorkers = async (
  page = 1,
  searchQuery = "",
  statusFilter: boolean | undefined
): Promise<PaginatedSalaryWorkersResponse> => {
  let workers = salaryWorkersData.results.workers;
  if (searchQuery) {
    workers = workers.filter(
      (worker) =>
        worker.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (statusFilter !== undefined) {
    workers = workers.filter((worker) => worker.is_still_active === statusFilter);
  }
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedWorkers = workers.slice(startIndex, startIndex + itemsPerPage);
  return {
    count: workers.length,
    next: paginatedWorkers.length === itemsPerPage ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    results: { workers: paginatedWorkers },
  };
};

export const getContractors = async (
  page = 1,
  searchQuery = "",
  statusFilter: boolean | undefined
): Promise<PaginatedContractorsResponse> => {
  let contractors = contractorsData.results.contractor;
  if (searchQuery) {
    contractors = contractors.filter(
      (contractor) =>
        contractor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contractor.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (statusFilter !== undefined) {
    contractors = contractors.filter(
      (contractor) => contractor.is_still_active === statusFilter
    );
  }
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedContractors = contractors.slice(startIndex, startIndex + itemsPerPage);
  return {
    count: contractors.length,
    next: paginatedContractors.length === itemsPerPage ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    results: { contractor: paginatedContractors },
  };
};

export const getSalaryWorkerDetails = async (id: number): Promise<SalaryWorker> => {
  const worker = salaryWorkersData.results.workers.find((w) => w.id === id);
  if (!worker) throw new Error("Salary worker not found");
  return worker;
};

export const getContractorDetails = async (id: number): Promise<Contractor> => {
  const contractor = contractorsData.results.contractor.find((c) => c.id === id);
  if (!contractor) throw new Error("Contractor not found");
  return contractor;
};

export const deleteWorker = async (id: number, type: "salary" | "contractor") => {
  // Simulate deletion (in a real app, you'd update the JSON file or in-memory data)
  if (type === "salary") {
    salaryWorkersData.results.workers = salaryWorkersData.results.workers.filter(
      (w) => w.id !== id
    );
  } else {
    contractorsData.results.contractor = contractorsData.results.contractor.filter(
      (c) => c.id !== id
    );
  }
};

export const fetchRecords = async (
  id: string,
  page: number,
  type: "salary-workers" | "contractors"
): Promise<PaginatedRecordsResponse> => {
  const recordsData = type === "salary-workers" ? salaryWorkerRecordsData : contractorRecordsData;
  const workerRecords = recordsData.find(
    (r) => r[`${type === "salary-workers" ? "worker_id" : "contractor_id"}`] === parseInt(id)
  );

  if (!workerRecords) {
    return { count: 0, next: null, previous: null, results: [] };
  }

  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedRecords = workerRecords.records.slice(startIndex, startIndex + itemsPerPage);

  return {
    count: workerRecords.records.length,
    next: paginatedRecords.length === itemsPerPage ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    results: paginatedRecords,
  };
};

export const addRecord = async (
  id: string,
  type: "salary-workers" | "contractors",
  record: { report: string; date?: string }
): Promise<void> => {
  const recordsData = type === "salary-workers" ? salaryWorkerRecordsData : contractorRecordsData;
  const workerRecords = recordsData.find(
    (r) => r[`${type === "salary-workers" ? "worker_id" : "contractor_id"}`] === parseInt(id)
  );

  const workerData = type === "salary-workers"
    ? salaryWorkersData.results.workers.find((w) => w.id === parseInt(id))
    : contractorsData.results.contractor.find((c) => c.id === parseInt(id));

  if (!workerData) throw new Error(`${type === "salary-workers" ? "Salary worker" : "Contractor"} not found`);

  const newRecord = {
    id: Math.max(...recordsData.flatMap((r) => r.records.map((rec) => rec.id)), 0) + 1,
    report: record.report,
    date: record.date || new Date().toISOString().split("T")[0],
    worker: {
      id: parseInt(id),
      first_name: workerData.first_name,
      last_name: workerData.last_name,
    },
  };

  if (workerRecords) {
    workerRecords.records.push(newRecord);
  } else {
    recordsData.push({
      [`${type === "salary-workers" ? "worker_id" : "contractor_id"}`]: parseInt(id),
      records: [newRecord],
    });
  }
};

export const editRecord = async (
  id: string,
  recordId: number,
  type: "salary-workers" | "contractors",
  updatedData: { report: string }
): Promise<void> => {
  const recordsData = type === "salary-workers" ? salaryWorkerRecordsData : contractorRecordsData;
  const workerRecords = recordsData.find(
    (r) => r[`${type === "salary-workers" ? "worker_id" : "contractor_id"}`] === parseInt(id)
  );

  if (!workerRecords) throw new Error("Records not found");

  const recordIndex = workerRecords.records.findIndex((r) => r.id === recordId);
  if (recordIndex === -1) throw new Error("Record not found");

  workerRecords.records[recordIndex] = {
    ...workerRecords.records[recordIndex],
    report: updatedData.report,
  };
};

export const deleteRecord = async (
  id: string,
  recordId: number,
  type: "salary-workers" | "contractors"
): Promise<void> => {
  const recordsData = type === "salary-workers" ? salaryWorkerRecordsData : contractorRecordsData;
  const workerRecords = recordsData.find(
    (r) => r[`${type === "salary-workers" ? "worker_id" : "contractor_id"}`] === parseInt(id)
  );

  if (!workerRecords) throw new Error("Records not found");

  workerRecords.records = workerRecords.records.filter((r) => r.id !== recordId);
};

export const fetchWorkerDetails = async (
  type: string,
  workerId: string,
  paymentPage: number,
  productPage: number
): Promise<any> => {
  // Find matching details entry
  const key = `${type}/${workerId}`;
  const worker = workerDetailsData.find((w: any) => w.worker_id === key);

  // If no explicit details entry, try to derive minimal info from workers lists
  let first_name = "";
  let last_name = "";

  if (!worker) {
    if (type === "salary-workers") {
      const w = salaryWorkersData.results.workers.find((s: any) => s.id === parseInt(workerId));
      if (w) {
        first_name = w.first_name || "";
        last_name = w.last_name || "";
      }
    } else if (type === "contractors") {
      const c = contractorsData.results.contractor.find((c: any) => c.id === parseInt(workerId));
      if (c) {
        first_name = c.first_name || "";
        last_name = c.last_name || "";
      }
    }
  } else {
    first_name = worker.first_name || "";
    last_name = worker.last_name || "";
  }

  // Payments and products arrays (fallback to empty arrays)
  const paymentsArray = (worker && worker.payments && Array.isArray(worker.payments.results)) ? worker.payments.results : [];
  const productsArray = (worker && worker.products && Array.isArray(worker.products.results)) ? worker.products.results : [];

  // Pagination
  const itemsPerPage = 10;
  const paymentStartIndex = (paymentPage - 1) * itemsPerPage;
  const paginatedPayments = paymentsArray.slice(paymentStartIndex, paymentStartIndex + itemsPerPage);

  // Pagination for products
  const productStartIndex = (productPage - 1) * itemsPerPage;
  const rawPaginatedProducts = productsArray.slice(
    productStartIndex,
    productStartIndex + itemsPerPage
  );

  // Normalize product items to expected shape: { id, date, product: { id, name, project, selling_price, progress } }
  const paginatedProducts = rawPaginatedProducts.map((item: any) => {
    if (item.product) return item; // already in expected shape
    return {
      id: item.id ?? (item.product?.id ?? 0),
      date: item.date ?? item.product?.date ?? "",
      product: {
        id: item.product?.id ?? item.id ?? 0,
        name: item.product?.name ?? item.name ?? "",
        project: item.product?.project ?? item.project ?? 0,
        selling_price: item.product?.selling_price ?? item.selling_price ?? 0,
        progress: item.product?.progress ?? item.progress ?? 0,
      },
    };
  });

  return {
    worker_id: key,
    first_name,
    last_name,
    payments: {
      results: paginatedPayments,
      count: paymentsArray.length,
      next: paginatedPayments.length === itemsPerPage ? `page=${paymentPage + 1}` : null,
      previous: paymentPage > 1 ? paymentPage - 1 : null,
      last_page: Math.ceil(paymentsArray.length / itemsPerPage) || 1,
    },
    products: {
      results: paginatedProducts,
      count: productsArray.length,
      next: paginatedProducts.length === itemsPerPage ? `page=${productPage + 1}` : null,
      previous: productPage > 1 ? productPage - 1 : null,
      last_page: Math.ceil(productsArray.length / itemsPerPage) || 1,
    },
  };
};

export const addSalaryWorker = async (data: FormData): Promise<void> => {
  const newWorker: SalaryWorker = {
    id: Math.max(...salaryWorkersData.results.workers.map((w) => w.id), 0) + 1,
    first_name: data.get("first_name") as string,
    last_name: data.get("last_name") as string,
    email: data.get("email") as string,
    phone_number: data.get("phone_number") as string,
    address: data.get("address") as string,
    craft_specialty: data.get("craft_specialty") as string,
    years_of_experience: parseInt(data.get("years_of_experience") as string) || 0,
    position: data.get("position") as string,
    salary: parseInt(data.get("salary") as string) || 0,
    is_still_active: data.get("is_still_active") === "true",
    date_joined: data.get("date_joined") as string,
    date_left: data.get("date_left") as string || null,
    guarantor_name: data.get("guarantor_name") as string || null,
    guarantor_phone_number: data.get("guarantor_phone_number") as string || null,
    guarantor_address: data.get("guarantor_address") as string || null,
    image: null,
    agreement_form_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  salaryWorkersData.results.workers.push(newWorker);
};

export const updateSalaryWorker = async (id: string, data: FormData): Promise<void> => {
  const workerIndex = salaryWorkersData.results.workers.findIndex((w) => w.id === parseInt(id));
  if (workerIndex === -1) throw new Error("Salary worker not found");

  const updatedWorker: SalaryWorker = {
    ...salaryWorkersData.results.workers[workerIndex],
    first_name: data.get("first_name") as string || salaryWorkersData.results.workers[workerIndex].first_name,
    last_name: data.get("last_name") as string || salaryWorkersData.results.workers[workerIndex].last_name,
    email: data.get("email") as string || salaryWorkersData.results.workers[workerIndex].email,
    phone_number: data.get("phone_number") as string || salaryWorkersData.results.workers[workerIndex].phone_number,
    address: data.get("address") as string || salaryWorkersData.results.workers[workerIndex].address,
    craft_specialty: data.get("craft_specialty") as string || salaryWorkersData.results.workers[workerIndex].craft_specialty,
    years_of_experience:
      parseInt(data.get("years_of_experience") as string) || salaryWorkersData.results.workers[workerIndex].years_of_experience,
    position: data.get("position") as string || salaryWorkersData.results.workers[workerIndex].position,
    salary: parseInt(data.get("salary") as string) || salaryWorkersData.results.workers[workerIndex].salary,
    is_still_active: data.get("is_still_active") === "true",
    date_joined: data.get("date_joined") as string || salaryWorkersData.results.workers[workerIndex].date_joined,
    date_left: data.get("date_left") as string || salaryWorkersData.results.workers[workerIndex].date_left,
    guarantor_name: data.get("guarantor_name") as string || salaryWorkersData.results.workers[workerIndex].guarantor_name,
    guarantor_phone_number: data.get("guarantor_phone_number") as string || salaryWorkersData.results.workers[workerIndex].guarantor_phone_number,
    guarantor_address: data.get("guarantor_address") as string || salaryWorkersData.results.workers[workerIndex].guarantor_address,
    image: data.get("image") ? "updated_image.jpg" : salaryWorkersData.results.workers[workerIndex].image,
    agreement_form_image: data.get("agreement_form_image") ? "updated_agreement_form.jpg" : salaryWorkersData.results.workers[workerIndex].agreement_form_image,
    updated_at: new Date().toISOString(),
  };

  salaryWorkersData.results.workers[workerIndex] = updatedWorker;
};

export const addContractor = async (data: FormData): Promise<void> => {
  const newContractor: Contractor = {
    id: Math.max(...contractorsData.results.contractor.map((c) => c.id), 0) + 1,
    first_name: data.get("first_name") as string,
    last_name: data.get("last_name") as string,
    email: data.get("email") as string,
    phone_number: data.get("phone_number") as string,
    address: data.get("address") as string,
    craft_specialty: data.get("craft_specialty") as string,
    years_of_experience: parseInt(data.get("years_of_experience") as string) || 0,
    contract_value: 0, // Default value, as not provided in form
    contract_type: "Monthly", // Default value
    is_still_active: data.get("is_still_active") === "true",
    date_joined: data.get("date_joined") as string,
    date_left: data.get("date_left") as string || null,
    guarantor_name: data.get("guarantor_name") as string || null,
    guarantor_phone_number: data.get("guarantor_phone_number") as string || null,
    guarantor_address: data.get("guarantor_address") as string || null,
    image: null,
    agreement_form_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  contractorsData.results.contractor.push(newContractor);
};

export const updateContractor = async (id: string, data: FormData): Promise<void> => {
  const contractorIndex = contractorsData.results.contractor.findIndex((c) => c.id === parseInt(id));
  if (contractorIndex === -1) throw new Error("Contractor not found");

  const updatedContractor: Contractor = {
    ...contractorsData.results.contractor[contractorIndex],
    first_name: data.get("first_name") as string || contractorsData.results.contractor[contractorIndex].first_name,
    last_name: data.get("last_name") as string || contractorsData.results.contractor[contractorIndex].last_name,
    email: data.get("email") as string || contractorsData.results.contractor[contractorIndex].email,
    phone_number: data.get("phone_number") as string || contractorsData.results.contractor[contractorIndex].phone_number,
    address: data.get("address") as string || contractorsData.results.contractor[contractorIndex].address,
    craft_specialty: data.get("craft_specialty") as string || contractorsData.results.contractor[contractorIndex].craft_specialty,
    years_of_experience:
      parseInt(data.get("years_of_experience") as string) || contractorsData.results.contractor[contractorIndex].years_of_experience,
    contract_value: contractorsData.results.contractor[contractorIndex].contract_value,
    contract_type: contractorsData.results.contractor[contractorIndex].contract_type,
    is_still_active: data.get("is_still_active") === "true",
    date_joined: data.get("date_joined") as string || contractorsData.results.contractor[contractorIndex].date_joined,
    date_left: data.get("date_left") as string || contractorsData.results.contractor[contractorIndex].date_left,
    guarantor_name: data.get("guarantor_name") as string || contractorsData.results.contractor[contractorIndex].guarantor_name,
    guarantor_phone_number: data.get("guarantor_phone_number") as string || contractorsData.results.contractor[contractorIndex].guarantor_phone_number,
    guarantor_address: data.get("guarantor_address") as string || contractorsData.results.contractor[contractorIndex].guarantor_address,
    image: data.get("image") ? "updated_image.jpg" : contractorsData.results.contractor[contractorIndex].image,
    agreement_form_image: data.get("agreement_form_image") ? "updated_agreement_form.jpg" : contractorsData.results.contractor[contractorIndex].agreement_form_image,
    updated_at: new Date().toISOString(),
  };

  contractorsData.results.contractor[contractorIndex] = updatedContractor;
};

// Backwards-compatible aliases for imports expecting `fetch*` names
export const fetchSalaryWorkers = async (
  page = 1,
  searchQuery = "",
  statusFilter: boolean | undefined = undefined
): Promise<PaginatedSalaryWorkersResponse> => {
  return await getSalaryWorkers(page, searchQuery, statusFilter);
};

export const fetchContractors = async (
  page = 1,
  searchQuery = "",
  statusFilter: boolean | undefined = undefined
): Promise<PaginatedContractorsResponse> => {
  return await getContractors(page, searchQuery, statusFilter);
};

// Add a salary worker record (wrapper around addRecord but explicit)
export const addSalaryWorkerRecord = async (
  salaryWorkerId: string,
  record: { report: string; date?: string }
): Promise<void> => {
  // Find existing entry
  let workerRecords = salaryWorkerRecordsData.find((r: any) => r.worker_id === parseInt(salaryWorkerId));

  // Find worker info
  const workerData = salaryWorkersData.results.workers.find((w) => w.id === parseInt(salaryWorkerId));
  const newId = Math.max(0, ...salaryWorkerRecordsData.flatMap((r: any) => r.records.map((rec: any) => rec.id))) + 1;

  const newRecord = {
    id: newId,
    report: record.report,
    date: record.date || new Date().toISOString().split("T")[0],
    worker: {
      id: parseInt(salaryWorkerId),
      first_name: workerData?.first_name || "",
      last_name: workerData?.last_name || "",
    },
  };

  if (workerRecords) {
    workerRecords.records.push(newRecord);
  } else {
    salaryWorkerRecordsData.push({ worker_id: parseInt(salaryWorkerId), records: [newRecord] });
  }
};

export const updateSalaryWorkerRecord = async (
  salaryWorkerId: string,
  recordId: number,
  updated: { report?: string; date?: string }
): Promise<void> => {
  const workerRecords = salaryWorkerRecordsData.find((r: any) => r.worker_id === parseInt(salaryWorkerId));
  if (!workerRecords) return;
  const rec = workerRecords.records.find((r: any) => r.id === recordId);
  if (!rec) return;
  if (updated.report !== undefined) rec.report = updated.report;
  if (updated.date !== undefined) rec.date = updated.date;
};

// Get paginated salary worker records
export const getSalaryWorkerRecords = async (salaryWorkerId: string, page: number = 1) => {
  const workerRecord = salaryWorkerRecordsData.find((r: any) => r.worker_id === parseInt(salaryWorkerId));
  const records = workerRecord ? workerRecord.records : [];
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedRecords = records.slice(startIndex, startIndex + itemsPerPage);
  return {
    count: records.length,
    next: paginatedRecords.length === itemsPerPage ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    results: paginatedRecords,
  };
};

// Delete a salary worker record
export const deleteSalaryWorkerRecord = async (salaryWorkerId: string, recordId: number) => {
  const workerRecord = salaryWorkerRecordsData.find((r: any) => r.worker_id === parseInt(salaryWorkerId));
  if (!workerRecord) return;
  workerRecord.records = workerRecord.records.filter((r: any) => r.id !== recordId);
};

// Add a contractor record
export const addContractorRecord = async (contractorId: string, record: { report: string; date?: string }) => {
  let contractorRecord = contractorRecordsData.find((r: any) => r.contractor_id === parseInt(contractorId));
  if (!contractorRecord) {
    contractorRecord = {
      contractor_id: parseInt(contractorId),
      records: [],
    };
    contractorRecordsData.push(contractorRecord);
  }
  const newId = contractorRecord.records.length > 0 ? Math.max(...contractorRecord.records.map((r: any) => r.id)) + 1 : 1;
  contractorRecord.records.push({
    id: newId,
    report: record.report,
    date: record.date || new Date().toISOString().slice(0, 10),
    worker: {
      id: parseInt(contractorId),
      first_name: "",
      last_name: "",
    },
  });
};

// Update a contractor record
export const updateContractorRecord = async (contractorId: string, recordId: number, updated: { report: string; date?: string }) => {
  let contractorRecord = contractorRecordsData.find((r: any) => r.contractor_id === parseInt(contractorId));
  if (!contractorRecord) return;
  const rec = contractorRecord.records.find((r: any) => r.id === recordId);
  if (!rec) return;
  rec.report = updated.report;
  if (updated.date) rec.date = updated.date;
};

// Delete a contractor record
export const deleteContractorRecord = async (contractorId: string, recordId: number) => {
  let contractorRecord = contractorRecordsData.find((r: any) => r.contractor_id === parseInt(contractorId));
  if (!contractorRecord) return;
  contractorRecord.records = contractorRecord.records.filter((r: any) => r.id !== recordId);
};

// Get paginated contractor records
export const getContractorRecords = async (contractorId: string, page: number = 1) => {
  const contractorRecord = contractorRecordsData.find((r: any) => r.contractor_id === parseInt(contractorId));
  const records = contractorRecord ? contractorRecord.records : [];
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedRecords = records.slice(startIndex, startIndex + itemsPerPage);
  return {
    count: records.length,
    next: paginatedRecords.length === itemsPerPage ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    results: paginatedRecords,
  };
};

// Get a single contractor record
export const getContractorRecord = async (contractorId: string, recordId: number) => {
  const contractorRecord = contractorRecordsData.find((r: any) => r.contractor_id === parseInt(contractorId));
  if (!contractorRecord) return null;
  return contractorRecord.records.find((r: any) => r.id === recordId) || null;
};

// Get worker details (wrapper to preserve old import name/signature)
export const getWorkerDetails = async (
  type: string,
  workerId: string,
  paymentPage: number = 1,
  productPage: number = 1
) => {
  try {
    return await fetchWorkerDetails(type, workerId, paymentPage, productPage);
  } catch (e) {
    // Fallback: return an empty, safe shape so UI can render without error
    let first_name = "";
    let last_name = "";
    if (type === "salary-workers") {
      const w = salaryWorkersData.results.workers.find((s: any) => s.id === parseInt(workerId));
      if (w) {
        first_name = w.first_name || "";
        last_name = w.last_name || "";
      }
    } else if (type === "contractors") {
      const c = contractorsData.results.contractor.find((c: any) => c.id === parseInt(workerId));
      if (c) {
        first_name = c.first_name || "";
        last_name = c.last_name || "";
      }
    }
    return {
      worker_id: `${type}/${workerId}`,
      first_name,
      last_name,
      payments: { results: [], count: 0, next: null, previous: null, last_page: 1 },
      products: { results: [], count: 0, next: null, previous: null, last_page: 1 },
    };
  }
};

// Get salary workers summary
export const getSalaryWorkersSummary = async () => {
  return workersSummaryData as WorkersSummary;
};

// Get contractors summary
export const getContractorsSummary = async () => {
  return workersSummaryData as WorkersSummary;
};