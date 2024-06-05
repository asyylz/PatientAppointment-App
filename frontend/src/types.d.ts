interface Department {
  _id: number;
  departmentMain: string;
  departmentSub: [string];
}

interface DepartmentsState {
  departments: Department[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
