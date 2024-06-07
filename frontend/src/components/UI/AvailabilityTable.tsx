import React from 'react';
import classes from './AvailabilityTable.module.css';
import { RootState } from './../../store/index';
import { useSelector } from 'react-redux';

interface AvailabilityProps {
  availability: Availability;
}

const AvailabilityTable: React.FC<AvailabilityProps> = ({ availability }) => {

console.log(availability);

  return (
    <div className={classes.wrapper}>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>9:00 AM</td>
            <td>9:00 AM</td>
            <td>9:00 AM</td>
            <td>9:00 AM</td>
            <td>9:00 AM</td>
            <td>9:00 AM</td>
            <td>9:00 AM</td>
            <td>-</td>
          </tr>
          <tr>
            <td>10:00 AM</td>
            <td>10:00 AM</td>
            <td>10:00 AM</td>
            <td>10:00 AM</td>
            <td>10:00 AM</td>
            <td>10:00 AM</td>
            <td>10:00 AM</td>
            <td>-</td>
          </tr>
          <tr>
            <td>11:00 AM</td>
            <td>11:00 AM</td>
            <td>11:00 AM</td>
            <td>11:00 AM</td>
            <td>11:00 AM</td>
            <td>11:00 AM</td>
            <td>11:00 AM</td>
            <td>-</td>
          </tr>
          <tr>
            <td>12:00 PM</td>
            <td>12:00 PM</td>
            <td>12:00 PM</td>
            <td>12:00 PM</td>
            <td>12:00 PM</td>
            <td>12:00 PM</td>
            <td>12:00 PM</td>
            <td>-</td>
          </tr>
          <tr>
            <td>1:00 PM</td>
            <td>1:00 PM</td>
            <td>1:00 PM</td>
            <td>1:00 PM</td>
            <td>1:00 PM</td>
            <td>1:00 PM</td>
            <td>1:00 PM</td>
            <td>-</td>
          </tr>
          <tr>
            <td>2:00 PM</td>
            <td>2:00 PM</td>
            <td>2:00 PM</td>
            <td>2:00 PM</td>
            <td>2:00 PM</td>
            <td>2:00 PM</td>
            <td>2:00 PM</td>
            <td>-</td>
          </tr>
          <tr>
            <td>3:00 PM</td>
            <td>3:00 PM</td>
            <td>3:00 PM</td>
            <td>3:00 PM</td>
            <td>3:00 PM</td>
            <td>3:00 PM</td>
            <td>3:00 PM</td>
            <td>-</td>
          </tr>
          <tr>
            <td>4:00 PM</td>
            <td>4:00 PM</td>
            <td>4:00 PM</td>
            <td>4:00 PM</td>
            <td>4:00 PM</td>
            <td>4:00 PM</td>
            <td>4:00 PM</td>
            <td>-</td>
          </tr>
          <tr>
            <td>5:00 PM</td>
            <td>5:00 PM</td>
            <td>5:00 PM</td>
            <td>5:00 PM</td>
            <td>5:00 PM</td>
            <td>5:00 PM</td>
            <td>5:00 PM</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilityTable;
