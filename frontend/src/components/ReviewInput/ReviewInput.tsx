import React from 'react';
import classes from './ReviewInput.module.css';

interface ReviewProps {
  attributeName: string;
  //setRatingsAndComment: (prevRatings: any) => string | void;
  setRatingsAndComment: React.Dispatch<
    React.SetStateAction<AttributesAndComment>
  >;
  ratingsAndComment: AttributesAndComment;
}

const Review: React.FC<ReviewProps> = ({
  attributeName,
  ratingsAndComment,
  setRatingsAndComment,
}) => {
console.log(ratingsAndComment)

  const handleRatingChange = (value: number) => {
    console.log(value)
    setRatingsAndComment((prevRatings) => ({
      ...prevRatings,
      [attributeName.toLowerCase()]: value,
    }));
  };

  return (
    <div className={classes.wrapper} key={attributeName}>
      <p>{attributeName}</p>
      <fieldset className={`${classes.container} ${classes.rating}`}>
        {[5, 4, 3, 2, 1].map((value) => (
          <React.Fragment key={value}>
            <input
              type="radio"
              name={attributeName}
              id={`${attributeName}-rate${value}`} // id and label must be same
              //id={`rate${value}`} // id and label must be same
              checked={ratingsAndComment[attributeName.toLowerCase()] === value}
              onChange={() => handleRatingChange(value)}
            />
            {/* <label htmlFor={`rate${value}`}> */}
            <label htmlFor={`${attributeName}-rate${value}`}>
              <svg
                id="Object"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1122 1122"
              >
                <path
                  className={classes.unfilled}
                  d="m570.497,252.536l93.771,190c1.543,3.126,4.525,5.292,7.974,5.794l209.678,30.468c8.687,1.262,12.156,11.938,5.87,18.065l-151.724,147.895c-2.496,2.433-3.635,5.939-3.046,9.374l35.817,208.831c1.484,8.652-7.597,15.25-15.367,11.165l-187.542-98.596c-3.085-1.622-6.771-1.622-9.857,0l-187.542,98.596c-7.77,4.085-16.851-2.513-15.367-11.165l35.817-208.831c.589-3.436-.55-6.941-3.046-9.374l-151.724-147.895c-6.286-6.127-2.817-16.803,5.87-18.065l209.678-30.468c3.45-.501,6.432-2.668,7.974-5.794l93.771-190c3.885-7.872,15.11-7.872,18.995,0Z"
                />
                <path
                  className={classes.filled}
                  d="m561,296.423l-83.563,161.857c-4.383,8.49-12.797,14.155-22.312,15.024l-181.433,16.562,191.688,8.964c12.175.569,23.317-6.81,27.543-18.243l68.077-184.164Z"
                />
                <path
                  className={classes.fade}
                  d="m357.284,838.933l-4.121,24.03c-1.484,8.652,7.597,15.25,15.367,11.165l187.541-98.596c3.086-1.622,6.771-1.622,9.857,0l187.541,98.596c7.77,4.085,16.851-2.513,15.367-11.165l-35.817-208.831c-.589-3.435.55-6.941,3.046-9.374l151.724-147.894c6.287-6.127,2.818-16.802-5.87-18.065l-70.23-10.205c-113.59,203.853-287.527,311.181-454.405,370.34Z"
                />
              </svg>
            </label>
          </React.Fragment>
        ))}
        <div className={classes.ratingValue}>
          <p>{ratingsAndComment?.[attributeName.toLowerCase()]}</p>
        </div>
      </fieldset>
    </div>
  );
};

export default Review;
