import React, { useState } from 'react';
import classes from './AppointmentForm.module.css';
import useHttp from '../../hooks/useHttp/useHttp';
import CustomInput from '../CustomInput/CustomInput';
import ModalCustom from '../ModalCustom/ModalCustom';
import ReviewInput from '../ReviewInput/ReviewInput';
const reviewCriterias = ['Staff', 'Punctual', 'Helpful', 'Knowledge'];
import { dateForCustomInput } from './../../helper/generateDates';

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

  const [updatedAppointmentData, setUpdatedAppointmentData] =
    useState<AppointmentForUpdate>({
      appointmentDateAndTime: appointment.appointmentDateAndTime,
      reason: appointment.reason,
    });

  //console.log(typeof appointment._id);

  const [openModalDeleteOrComment, setOpenModalDeleteOrComment] =
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === 'appointmentDate') {
      setAppointmentDate(value);
      const formatted = `${value}T${appointmentTime}`;
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDateAndTime: formatted,
      }));
    } else if (name === 'appointmentTime') {
      setAppointmentTime(value);
      const formatted = `${appointmentDate}T${value}:00.000Z`;
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
      setOpenModalDeleteOrComment('');
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
      setOpenModalDeleteOrComment('');
    }
  };
  const isPast = new Date(appointment.appointmentDateAndTime) < new Date();

  return (
    <>
      {/* /* -------------- Appointment Delete Notification Modal ------------- */}
      {openModalDeleteOrComment === 'open' && (
        <ModalCustom height="150px" width="300px">
          <p>
            {isPatient
              ? 'You are about to cancel your recent appointment?'
              : "Please confirm to delete the patient's appointment?"}
          </p>
          <div className="buttonContainer" style={{ flexDirection: 'row' }}>
            <button style={{ color: 'red' }} onClick={handleDeleteAppointment}>
              Confirm
            </button>
            <button
              style={{ color: 'blue' }}
              onClick={() => setOpenModalDeleteOrComment('')}
            >
              Cancel
            </button>
          </div>
        </ModalCustom>
      )}
      {/* /* -------------------- Comment Form -------------------- */}
      {openModalDeleteOrComment === 'comment' && (
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
                  setOpenModalDeleteOrComment('');
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
        <p className={classes.title}>Appointment Details</p>
        <form onSubmit={handleSubmit}>
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
            value={
              updatedAppointmentData?.appointmentDateAndTime &&
              dateForCustomInput(updatedAppointmentData?.appointmentDateAndTime)
            }
            type="date"
            name="appointmentDate"
            onChange={handleChange}
            readOnly={isPast}
          />

          <CustomInput
            placeHolder="Appointment Time"
            value={
              updatedAppointmentData?.appointmentDateAndTime &&
              updatedAppointmentData?.appointmentDateAndTime
                .split('T')[1]
                .slice(0, 5)
            }
            name="appointmentTime"
            type="time"
            step={1800}
            onChange={handleChange}
            readOnly={isPast}
          />
          <textarea
            className={classes.reason}
            placeholder="Please write your concerns..."
            value={updatedAppointmentData?.reason}
            name="reason"
            onChange={handleChange}
            rows={8}
            cols={36}
            style={isPast ? { opacity: 0.7, backgroundColor: 'lightgray' } : {}}
            readOnly={isPast}
          ></textarea>

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
          {appointment.status === 'completed' && isPast && isPatient && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpenModalDeleteOrComment('comment');
              }}
              style={{
                fontSize: '12px',
                height: '30px',
                marginBottom: '5px',
              }}
            >
              Leave comment
            </button>
          )}

          <div className={classes.buttonContainer}>
            <button type="submit">Update</button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpenModalDeleteOrComment('open');
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
