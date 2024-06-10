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

interface EntityState<T> {
  entities: T[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
interface ExtendedEntityState<T> extends EntityState<T> {
  selectedDoctor?: T;
}

interface RootState {
  departments: ExtendedEntityState<Department>;
  doctors: ExtendedEntityState<Doctor>;
  selectedDoctor: Doctor;
  reviews: ExtendedEntityState<Review>;
}


/* ----------------------- DOCTOR ----------------------- */
interface ObjectId {
  $oid: string;
}

//type $oid = string;

interface Doctor {
  _id: ObjectId;
  id: number;
  gender: string;
  image: string;
  availability: Availability;
  phone: string;
  address: Address;
  reviews: Reviews[];
  __v: number;
  firstName: string;
  lastName: string;
  departmentId: string;
  departmentName: string;
}
interface Address {
  street: string;
  city: string;
  prov: string;
  postal: string;
  _id: ObjectId;
}
interface Availability {
  [day: string]: string;
}

/* ----------------------- REVIEWS ----------------------- */
interface Review {
  _id: ObjectId;
  name: string;
  rating: number;
  doctorId: string;
  comments: string;
  attributes: Attributes;
}
interface Attributes {
  _id: ObjectId;
  staff: number;
  punctual: number;
  helpful: number;
  knowledge: number;
}
