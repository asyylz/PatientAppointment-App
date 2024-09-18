interface ObjectId {
  $oid: string;
}

/* ------------------- ENTITIES STATES ------------------ */
interface EntityState<T> {
  entities: Draft<T[]>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
interface EntityStateForUser<T> {
  entities: Draft<T>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface EntityStateForAppointments<T> {
  entities: Draft<T>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface ExtendedEntityState<T> extends EntityState<T> {
  selectedDoctor?: T | null;
}

/* --------------------- ROOT STATE --------------------- */
interface RootState {
  departments: EntityState<Department>;
  appointmentsForDoctor: EntityStateForAppointments<AppointmentsForDoctor>;
  appointmentsForPatient: EntityStateForAppointments<AppointmentsForPatient>;
  reviews: EntityState<Review>;
  doctors: ExtendedEntityState<Doctor>;
  //selectedDoctor: Doctor;
  currentUser: CurrentUser;
  search: string;
}

/* --------------------- DEPARTMENTS -------------------- */
interface Department {
  _id: string;
  departmentMain: string;
  departmentSub: [string];
}

interface DepartmentState {
  departments: Department[];
}

/* ----------------------- DOCTOR ----------------------- */
interface Doctor {
  _id: string;
  id: number;
  userId?: { _id: string; image: string };
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
    _id: string;
    departmentMain: string;
    departmentSub: string[];
  };
  doctorDescription: string;
}
// interface Address {
//   street: string;
//   city: string;
//   prov: string;
//   postal: string;
//   _id: ObjectId;
// }
/* -------------------- AVAILABILITIES -------------------- */
interface Availability {
  _id: string;
  doctorId: string;
  day: string;
  time: string;
  currentWeekAvailabilityInDateFormat: Date | string;
}

/* ----------------------- REVIEWS ----------------------- */
interface Review {
  _id: ObjectId;
  userId: {
    name: string;
    _id: ObjectId;
    image: string;
  };
  rating: number;
  doctorId: string;
  comments: string;
  attributes: Attributes;
  averageRating: number;
}
interface AttributesAndComment {
  // _id?: ObjectId; // optional does not work
  staff: number;
  punctual: number;
  helpful: number;
  knowledge: number;
  comments?: string | undefined;
  [key: string]: number | string | undefined; // Allow indexing by string
}

interface ReviewData {
  doctorId: string;
  userId?: string;
  attributes: AttributesAndComment;
  comments: string | undefined;
}
/* -------------------- CURRENT USER -------------------- */
interface CurrentUser {
  token: string;
  userData: userData | null;
  status:
    | 'idle'
    | 'loading'
    | 'login failed'
    | 'register failed'
    | 'failed'
    | 'success'
    | 'updatePassword success'
    | 'register success'
    | 'logout success'
    | 'logout failed'
    | 'login success'
    | 'update success'
    | 'forgotPassword success'
    | 'forgotPassword failed'
    | 'sent success'
    | 'refresh success'
    | 'refresh failed'
    | 'update failed'
    | 'resetPassword success'
    | null;
  error?: string | null;
}
interface userData {
  _id: string;
  role: string;
  name: string;
  email: string;
  doctorId?: string;
  DOB: date;
  __v?: number;
  image: string;
  policy: boolean;
  address?: Address;
}

interface CurrentUserPayload {
  token: string;
  data: {
    user: {
      _id: string;
      role: string;
      name: string;
      email: string;
      doctorId?: string;
      DOB: date;
      __v?: number;
      image: string;
      policy: boolean;
      address?: Address;
    } | null;
  };
  status: 'idle' | 'loading' | 'failed' | 'success' | null;
  error?: string | null;
}

interface UpdatedUserPasswordData {
  oldPassword: string | undefined;
  newPassword: string | undefined;
  confirmNewPassword: string | undefined;
}

interface PasswordResetData {
  password: string;
  passwordConfirm: string;
  resetToken: string;
}
interface Credentials {
  name?: string;
  email?: string;
  image?: string;
  password?: string;
  passwordConfirm?: string;
  policy?: boolean;
  DOB?: string | date;
  address?: Address;
}

type UpdateUserData = Credentials | null;
// interface UserData extends Credentials{

// }

// interface UpdateUserData extends Credentials {
//   address?: Address;
// }

// interface PrevValues {
//   prevValues: (value?: any) => string | string;
// }
interface Address {
  street?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  town?: string;
}
/* ------------------------ APPOINTMENT ----------------------- */
interface AppointmentsForPatient {
  appointmentsForPatient: Appointment[];
  upcomingAppointments: number;
  total: number;
}
interface AppointmentForBooking {
  patientId: string;
  doctorId: string | undefined;
  appointmentDateAndTime: date;
  reason: string;
}

interface Appointment {
  _id: string;
  patientId: { _id: string; name: string };
  // patientId: string | { _id: string; name: string };
  doctorId: {
    _id: string;
    firstName: string;
    lastName: string;
    departmentId: ObjectId;
  };
  appointmentDateAndTime: date;
  reason: string;
  diagnose: string;
  referral: boolean;
  status: string;
}

interface AppointmentForUpdate {
  appointmentDateAndTime: string;
  reason: string;
}

interface AppointmentsForDoctor {
  appointmentsForDoctor: SingleAppointmentForDoctor[];
}
interface SingleAppointmentForDoctor {
  _id: string;
  doctorId: string;
  patientId: {
    _id: ObjectId;
    name: string;
    email: string;
    DOB: date;
  };
  appointmentDateAndTime: date;
  reason: string;
  status: string;
  referral: boolean;
  diagnose: string;
  _v: number;
}
type combinedAppointmentType = SingleAppointmentForDoctor | Appointment;

/* -------------------- Contact Form -------------------- */
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject: string;
}
/* ------------------------------------------------------ */
/*                        TESTTING                        */
/* ------------------------------------------------------ */
declare namespace NodeJS {
  interface Global {
    importMetaEnv: {
      VITE_BASE_URL: string;
      VITE_NODE_ENV: string;
      VITE_SERVER_URL: string;
    };
  }
}
declare let global: NodeJS.Global;


