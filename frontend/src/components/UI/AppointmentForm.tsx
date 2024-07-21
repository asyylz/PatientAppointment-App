import React, { useState } from 'react';
import classes from './AppointmentForm.module.css';
import useHttp from '../../hooks/useHttp';
import CustomInput from './CustomInput';
import ModalCustom from './ModalCustom';
import ReviewInput from './../UI/ReviewInput';
const reviewCriterias = ['Staff', 'Punctual', 'Helpful', 'Knowledge'];

interface AppointmentFormProps {
  setOpenModal: (openModal: string) => void;
  appointment: Appointment | SingleAppointmentForDoctor;
  isPatient?: boolean;
  userId?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  setOpenModal,
  appointment,
  isPatient,
  userId,
}) => {
  const { updateAppointment, deleteAppointment, postReview } = useHttp();

  const [updatedAppointmentData, setUpdatedAppointmentData] = useState<
    object | undefined
  >();
  const [openModalDeleteAndComment, setOpenModalDeleteAndComment] =
    useState<string>('');

  const [appointmentDate, setAppointmentDate] = useState(
    appointment?.appointmentDateAndTime.split('T')[0]
  );
  const [appointmentTime, setAppointmentTime] = useState(
    appointment?.appointmentDateAndTime.split('T')[1]
  );
  const [ratingsAndComment, setRatingsAndComment] =
    useState<AttributesAndComment>({
      staff: 0,
      punctual: 0,
      helpful: 0,
      knowledge: 0,
      comments: '',
    });

  //console.log(ratingsAndComment);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === 'appointmentDate') {
      setAppointmentDate(value);
      const formatted = new Date(`${value}T${appointmentTime}`);
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDateAndTime: formatted,
      }));
    } else if (name === 'appointmentTime') {
      setAppointmentTime(value);
      const formatted = new Date(`${appointmentDate}T${value}:00.000Z`);
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDateAndTime: formatted,
      }));
    } else if (name === 'comments') {
      setRatingsAndComment((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    } else {
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await updateAppointment(
      updatedAppointmentData,
      appointment?._id
    );
    if (response.status === 'success') {
      setOpenModal('');
    }
  };

  const handleDeleteAppointment = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const response = await deleteAppointment(appointment?._id);
    if (response?.status === 204) {
      setOpenModalDeleteAndComment('');
      setOpenModal('');
    }
  };

  const handlePostReview = async () => {
    const doctorId = isPatient
      ? (appointment as Appointment).doctorId._id
      : (appointment as SingleAppointmentForDoctor).doctorId;

    const response = await postReview({
      doctorId,
      userId,
      comments: ratingsAndComment.comments,
      attributes: {
        staff: ratingsAndComment.staff,
        punctual: ratingsAndComment.punctual,
        knowledge: ratingsAndComment.knowledge,
        helpful: ratingsAndComment.helpful,
      },
    });

    if (response.status === 'success') {
      setRatingsAndComment({
        staff: 0,
        punctual: 0,
        helpful: 0,
        knowledge: 0,
        comments: '',
      });
      setOpenModalDeleteAndComment('');
    }
  };
  
  /* ------------------------------------------------------ */
  /*                           DOM                          */
  /* ------------------------------------------------------ */
  return (
    <>
      {/* /* -------------- Appointment Delete Notification Modal ------------- */}
      {openModalDeleteAndComment === 'open' && (
        <ModalCustom height="200px" width="600px">
          <p>You are about to cancel your recent appointment ?</p>
          <div className="buttonContainer" style={{ flexDirection: 'row' }}>
            <button style={{ color: 'red' }} onClick={handleDeleteAppointment}>
              Confirm
            </button>
            <button
              style={{ color: 'blue' }}
              onClick={() => setOpenModalDeleteAndComment('')}
            >
              Close
            </button>
          </div>
        </ModalCustom>
      )}
      {/* /* -------------------- Comment Form -------------------- */}
      {openModalDeleteAndComment === 'comment' && (
        <ModalCustom height="auto" width="auto">
          <div className={`${classes.container} ${classes.comment}`}>
            <CustomInput
              readOnly
              value={`Dr. ${(appointment as Appointment).doctorId.firstName} ${
                (appointment as Appointment)?.doctorId.lastName
              }`}
            />
            <div className={classes.reviewWrapper}>
              {reviewCriterias.map((criteria: string) => {
                return (
                  <ReviewInput
                    attributeName={criteria}
                    ratingsAndComment={ratingsAndComment}
                    setRatingsAndComment={setRatingsAndComment}
                  />
                );
              })}
            </div>
            <textarea
              name="comments"
              rows={8}
              cols={36}
              onChange={handleChange}
            ></textarea>
            <div className={classes.buttonContainer}>
              <button onClick={handlePostReview}>Comment</button>
              <button
                onClick={() => {
                  setOpenModalDeleteAndComment('');
                  setRatingsAndComment({
                    staff: 0,
                    punctual: 0,
                    helpful: 0,
                    knowledge: 0,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalCustom>
      )}
      {/* /* ------------------ Appointment Form ------------------ */}
      <div className={classes.container}>
        <h1 className={classes.title}>Appointment Details</h1>
        <form onSubmit={handleSubmit}>
          <div className={classes.leftSection}>
            <CustomInput
              value={
                isPatient
                  ? `Dr. ${(appointment as Appointment)?.doctorId?.firstName} ${
                      (appointment as Appointment)?.doctorId.lastName
                    }`
                  : (appointment as SingleAppointmentForDoctor)?.patientId?.name
              }
              readOnly
            />
            <CustomInput
              placeHolder="Appointment Date"
              defaultValue={appointment?.appointmentDateAndTime.split('T')[0]}
              // value={formatDateForUI(appointment?.appointmentDateAndTime)}
              type="date"
              name="appointmentDate"
              onChange={handleChange}
            />

            <CustomInput
              placeHolder="Appointment Time"
              //value={appointment?.appointmentDateAndTime}
              defaultValue={appointment?.appointmentDateAndTime
                .split('T')[1]
                .slice(0, 5)}
              name="appointmentTime"
              type="time"
              step={1800}
              onChange={handleChange}
            />
            <textarea
              className={classes.reason}
              placeholder="Please write your concerns..."
              name="reason"
              defaultValue={appointment?.reason}
              onChange={handleChange}
              rows={8}
              cols={36}
            ></textarea>
          </div>

          <div className={classes.rightSection}>
            {!isPatient ? (
              <select
                name="status"
                id="status"
                onChange={handleChange}
                defaultValue={appointment?.status}
              >
                <option>Pelease choose a status</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              <CustomInput value={appointment?.status} readOnly />
            )}
            {!isPatient ? (
              <select
                name="referral"
                id="referral"
                onChange={handleChange}
                defaultValue={appointment?.referral.toString()}
              >
                <option>Pelease choose a referral status</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : (
              <CustomInput
                value={appointment?.referral ? 'Referral' : 'Not referral'}
                readOnly
              />
            )}

            <textarea
              className={classes.result}
              defaultValue={appointment?.diagnose}
              placeholder="Please write diagnoses..."
              name="diagnose"
              onChange={handleChange}
              rows={8}
              cols={36}
              readOnly={isPatient}
              style={
                isPatient ? { opacity: 0.7, backgroundColor: 'lightgray' } : {}
              }
            ></textarea>
            {appointment.status === 'completed' &&
              new Date(appointment.appointmentDateAndTime) < new Date() && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenModalDeleteAndComment('comment');
                  }}
                >
                  Leave comment
                </button>
              )}
          </div>
          <div className={classes.buttonContainer}>
            <button type="submit">Update</button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpenModalDeleteAndComment('open');
              }}
            >
              Delete
            </button>
            <button onClick={() => setOpenModal('')}>Close</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;
