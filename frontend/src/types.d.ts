interface Department {
  _id: number;
  departmentMain: string;
  departmentSub: [string];
}

interface DepartmentState {
  departments: Department[];
}

interface DoctorState {
  doctors: Doctor[];
}

interface EntityState<T> {
  entities: T[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
interface EntityStateForUser<T> {
  image?: string;
  entities: T;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface EntityStateForAppointments<T> {
  entities: T;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface ExtendedEntityState<T> extends EntityState<T> {
  selectedDoctor?: T;
}

interface RootState {
  departments: EntityState<Department>;
  appointmentsForDoctor: EntityStateForAppointments<AppointmentForDoctors>;
  appointmentsForPatient: EntityStateForAppointments<AppointmentsForPatient>;
  reviews: EntityState<Review>;
  doctors: ExtendedEntityState<Doctor>;
  selectedDoctor: Doctor;
  currentUser: CurrentUser;
  search: string;
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
  availabilities: Availability[];
  phone: string;
  address: Address;
  reviews: Reviews[];
  __v: number;
  firstName: string;
  lastName: string;
  departmentId: {
    _id: ObjectId;
    departmentMain: string;
    departmentSub: [string];
  };
  doctorDescription: string;
}
interface Address {
  street: string;
  city: string;
  prov: string;
  postal: string;
  _id: ObjectId;
}
interface Availability {
  _id: ObjectId;
  doctorId: ObjectId;
  day: string;
  time: string;
}

/* ----------------------- REVIEWS ----------------------- */
interface Review {
  _id: ObjectId;
  name: string;
  rating: number;
  doctorId: string;
  comments: string;
  attributes: Attributes;
  averageRating: number;
}
interface Attributes {
  _id: ObjectId;
  staff: number;
  punctual: number;
  helpful: number;
  knowledge: number;
}
interface ReviewProps {
  attributeName: string;
  attributeValue: number;
}

/* -------------------- CURRENT USER -------------------- */
interface CurrentUser {
  token: string;
  userData: userData | null;
  image: string;
  status:
    | 'idle'
    | 'loading'
    | 'failed'
    | 'success'
    | 'logout success'
    | 'login success'
    | null;
  error?: string | null;
}
interface userData {
  _id: ObjectId;
  role: string;
  name: string;
  email: string;
  doctorId: ObjectId;
}

interface CurrentUserPayload {
  token: string;
  data: {
    user: {
      _id: ObjectId;
      role: string;
      name: string;
      email: string;
    } | null;
  };
  image: string;
  status:
    | 'idle'
    | 'loading'
    | 'failed'
    | 'success'
    | 'logout success'
    | 'login success'
    | null;
  error?: string | null;
}
/* ------------------------ APPOINTMENT ----------------------- */

interface AppointmentsForPatient {
  appointmentsForPatient: Appointment[];
  upcomingAppointments: number;
  total: number;
}
interface AppointmentForBooking {
  patientId: ObjectId | undefined;
  doctorId: ObjectId | undefined;
  appointmentDate: date;
  reason: string;
  time: string;
}

interface AppointmentForDoctors {
  appointmentsForDoctor: [
    {
      _id: ObjectId;
      doctorId: ObjectId;
      patientId: {
        _id: ObjectId;
        name: string;
        email: string;
        DOB: date;
      };
      appointmentDate: date;
      reason: string;
      time: string;
      status: string;
      referral: boolean;
      diagnose: string;
    }
  ];
}

interface Appointment {
  _id: ObjectId;
  patientId: ObjectId | undefined;
  doctorId: {
    _id: ObjectId | undefined;
    firstName: string;
    lastName: string;
    departmentId: ObjectId;
  };
  appointmentDate: date;
  reason: string;
  time: string;
}

/* ------------------ APPOINTMENT STATS ----------------- */
interface AppointmentStats {
  totalAppointments: number;
  upcomingAppointments: number;
}
