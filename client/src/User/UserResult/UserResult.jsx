import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import "./UserResult.css";
import logo from "./srtmunlogo.png";
import sign from "./sign.png";
import { useReactToPrint } from "react-to-print";
import { TfiPrinter } from "react-icons/tfi";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import HashLoader from "react-spinners/HashLoader";

function UserResult() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "mark-memo",
  });

  const [result, setResult] = useState(null);
  const [marks, setMarks] = useState([]);
  const [getYear, setgetYear] = useState("");
  const [previousSeatNo, setpreviousSeatNo] = useState("");

  const [resultPrevious, setResultPrevious] = useState(null);
  const [marksPrevious, setMarksPrevious] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const resultStr = sessionStorage.getItem("user-info");
    if (resultStr) {
      const resultObj = JSON.parse(resultStr);
      setResult(resultObj);
      setMarks(resultObj.marks);
      setgetYear(resultObj.batchyear);
      setpreviousSeatNo(resultObj.previousSeatNo);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (previousSeatNo !== "") {
      setLoading(true);
      async function fetchData() {
        const response = await axios.get(
          `http://localhost:5000/user/api/student-result-studentseatno?seatno=${previousSeatNo}`
        );
        if (response.data.message === "Successful") {
          const result = response.data.result;
          setResultPrevious(result);
          setMarksPrevious(result?.marks);
        }
      }
      fetchData();
      setLoading(false);
    }
  }, [previousSeatNo]);

  const totalInternal = marks.reduce(
    (acc, mark) => acc + mark.mark.internal,
    0
  );
  const totalExternal = marks.reduce(
    (acc, mark) => acc + (mark.mark.external || 0),
    0
  );
  const totalMarksObt = totalInternal + totalExternal;

  const totalInternalMax = marks.reduce(
    (acc, mark) => acc + mark.subject.max_marks,
    0
  );
  const totalExternalMax = marks.reduce((acc, mark) => {
    if (mark.subject.subject_type === "OT") {
      return acc + 0;
    } else {
      return acc + (mark.subject.max_marks || 0);
    }
  }, 0);

  const totalMarksMax = totalInternalMax + totalExternalMax;

  // only if previous sem is there

  const totalInternalPrevious = marksPrevious?.reduce(
    (acc, mark) => acc + mark.mark.internal,
    0
  );
  const totalExternalPrevious = marksPrevious?.reduce(
    (acc, mark) => acc + (mark.mark.external || 0),
    0
  );

  const totalMarksObtPrevious = totalInternalPrevious + totalExternalPrevious;

  const totalObtcurrentpluspreviousSem = totalMarksObt + totalMarksObtPrevious;

  const totalInternalMaxPrevious = marksPrevious?.reduce(
    (acc, mark) => acc + mark.subject.max_marks,
    0
  );

  const totalExternalMaxPrevious = marksPrevious?.reduce((acc, mark) => {
    if (mark.subject.subject_type === "OT") {
      return acc + 0;
    } else {
      return acc + (mark.subject.max_marks || 0);
    }
  }, 0);

  const totalMarksMaxPrevious =
    totalInternalMaxPrevious + totalExternalMaxPrevious;

  const totalMarkscurrentplusprevious = totalMarksMax + totalMarksMaxPrevious;

  // end of previous sem code

  function calculateGrade(totalMarks, subjectType) {
    let grade = "";
    if (subjectType === "TH") {
      // calculate grade out of 100 for theory subjects
      if (totalMarks >= 90 && totalMarks <= 100) {
        grade = "A+";
      } else if (totalMarks >= 80 && totalMarks <= 89) {
        grade = "A";
      } else if (totalMarks >= 70 && totalMarks <= 79) {
        grade = "B+";
      } else if (totalMarks >= 60 && totalMarks <= 69) {
        grade = "B";
      } else if (totalMarks >= 50 && totalMarks <= 59) {
        grade = "C+";
      } else if (totalMarks >= 45 && totalMarks <= 54) {
        grade = "C";
      } else if (totalMarks >= 40 && totalMarks <= 44) {
        grade = "D";
      } else if (totalMarks < 20) {
        grade = "F";
      }
    } else if (subjectType === "PR") {
      // calculate grade out of 50 for practical subjects
      if (totalMarks >= 45) {
        grade = "A+";
      } else if (totalMarks >= 40) {
        grade = "A";
      } else if (totalMarks >= 35) {
        grade = "B+";
      } else if (totalMarks >= 30) {
        grade = "B";
      } else if (totalMarks >= 25) {
        grade = "C+";
      } else if (totalMarks >= 20) {
        grade = "C";
      } else if (totalMarks < 10) {
        grade = "F";
      }
    } else if (subjectType === "OT") {
      // calculate grade out of 50 for practical subjects
      if (totalMarks >= 25) {
        grade = "A+";
      } else if (totalMarks >= 22) {
        grade = "A";
      } else if (totalMarks >= 20) {
        grade = "B+";
      } else if (totalMarks >= 17) {
        grade = "B";
      } else if (totalMarks >= 15) {
        grade = "C+";
      } else if (totalMarks >= 10) {
        grade = "C";
      } else if (totalMarks < 10) {
        grade = "F";
      }
    }

    return grade;
  }

  function calculateGradePTS(totalMarks, subjectType) {
    let gradepts = "";

    if (subjectType === "TH") {
      // calculate grade out of 100 for theory subjects
      if (totalMarks >= 90 && totalMarks <= 100) {
        gradepts = "10";
      } else if (totalMarks >= 80 && totalMarks <= 89) {
        gradepts = "9";
      } else if (totalMarks >= 70 && totalMarks <= 79) {
        gradepts = "8";
      } else if (totalMarks >= 60 && totalMarks <= 69) {
        gradepts = "7";
      } else if (totalMarks >= 50 && totalMarks <= 59) {
        gradepts = "6";
      } else if (totalMarks >= 45 && totalMarks <= 54) {
        gradepts = "5";
      } else if (totalMarks >= 40 && totalMarks <= 44) {
        gradepts = "4";
      } else {
        gradepts = "0";
      }
    } else if (subjectType === "PR") {
      // calculate grade out of 50 for practical subjects
      if (totalMarks >= 45) {
        gradepts = "10";
      } else if (totalMarks >= 40) {
        gradepts = "9";
      } else if (totalMarks >= 35) {
        gradepts = "8";
      } else if (totalMarks >= 30) {
        gradepts = "7";
      } else if (totalMarks >= 25) {
        gradepts = "6";
      } else if (totalMarks >= 20) {
        gradepts = "5";
      } else {
        gradepts = "0";
      }
    } else if (subjectType === "OT") {
      // calculate grade out of 50 for practical subjects
      if (totalMarks >= 25) {
        gradepts = "10";
      } else if (totalMarks >= 22) {
        gradepts = "9";
      } else if (totalMarks >= 20) {
        gradepts = "8";
      } else if (totalMarks >= 17) {
        gradepts = "7";
      } else if (totalMarks >= 15) {
        gradepts = "6";
      } else if (totalMarks >= 10) {
        gradepts = "5";
      } else {
        gradepts = "0";
      }
    }

    return gradepts;
  }

  function calculateTotalGradePoints(marks) {
    let totalGradePoints = 0;
    marks.forEach((mark) => {
      totalGradePoints += parseInt(
        calculateGradePTS(
          mark.mark.internal + mark.mark.external,
          mark.subject.subject_type
        )
      );
    });

    return { totalGradePoints };
  }

  const { totalGradePoints } = calculateTotalGradePoints(marks);

  function calculateTotalEarnedGradePoints(marks) {
    let totalEarnedGradePoints = 0;

    marks.forEach((mark) => {
      totalEarnedGradePoints +=
        calculateGradePTS(
          mark.mark.internal + mark.mark.external,
          mark.subject.subject_type
        ) * mark.subject.credits;
    });

    return totalEarnedGradePoints;
  }

  const totalEarnedGradePoints = calculateTotalEarnedGradePoints(marks);

  function calculateTotalCredits(marks) {
    let totalCredits = 0;

    marks.forEach((mark) => {
      totalCredits += mark.subject.credits;
    });

    return totalCredits;
  }

  const totalCredits = calculateTotalCredits(marks);

  // only if previus sem there

  function calculateTotalGradePointsPrevious(marksPrevious) {
    let totalGradePointsPrevious = 0;
    marksPrevious?.forEach((mark) => {
      totalGradePointsPrevious += parseInt(
        calculateGradePTS(
          mark.mark.internal + mark.mark.external,
          mark.subject.subject_type
        )
      );
    });

    return { totalGradePointsPrevious };
  }

  const { totalGradePointsPrevious } =
    calculateTotalGradePointsPrevious(marksPrevious);
  const totalGradePointsPreviousplusCurrent =
    totalGradePoints + totalGradePointsPrevious;

  function calculateTotalEarnedGradePointsPrevious(marksPrevious) {
    let totalEarnedGradePointsPrevious = 0;

    marksPrevious?.forEach((mark) => {
      totalEarnedGradePointsPrevious +=
        calculateGradePTS(
          mark.mark.internal + mark.mark.external,
          mark.subject.subject_type
        ) * mark.subject.credits;
    });

    return totalEarnedGradePointsPrevious;
  }

  const totalEarnedGradePointsPrevious =
    calculateTotalEarnedGradePointsPrevious(marksPrevious);
  const totalEarnedGradePointsPreviousplusCurrent =
    totalEarnedGradePoints + totalEarnedGradePointsPrevious;

  function calculateTotalCreditsPrevious(marksPrevious) {
    let totalCreditsPrevious = 0;

    marksPrevious?.forEach((mark) => {
      totalCreditsPrevious += mark.subject.credits;
    });

    return totalCreditsPrevious;
  }

  const totalCreditsPrevious = calculateTotalCreditsPrevious(marksPrevious);
  const totalCredtisPreviousplusCurrent = totalCredits + totalCreditsPrevious;

  // end of previus same totalgrade calculate code

  let yearShowinExamination = "";
  if (result?.semester === "I" || result?.semester === "II") {
    yearShowinExamination = "F.Y.";
  } else if (result?.semester === "III" || result?.semester === "IV") {
    yearShowinExamination = "S.Y.";
  }

  let semShowninExamination = "";
  if (result?.semester === "I") {
    semShowninExamination = "[SEM I]";
  } else if (result?.semester === "II") {
    semShowninExamination = "[SEM II]";
  } else if (result?.semester === "III") {
    semShowninExamination = "[SEM III]";
  } else if (result?.semester === "IV") {
    semShowninExamination = "[SEM IV]";
  }

  let monthShowinExamination = "";
  if (result?.semester === "I" || result?.semester === "III") {
    monthShowinExamination = "WINTER";
  } else if (result?.semester === "II" || result?.semester === "IV") {
    monthShowinExamination = "SUMMER";
  }

  let monthYearShowinExamination = "";
  const yearsArray = getYear.split("-");
  const [firstYear, secondYear] = yearsArray;
  if (result?.semester === "I") {
    monthYearShowinExamination = firstYear;
  } else if (result?.semester === "II") {
    monthYearShowinExamination = secondYear;
  } else if (result?.semester === "III") {
    monthYearShowinExamination = firstYear;
  } else if (result?.semester === "IV") {
    monthYearShowinExamination = secondYear;
  }

  const user_info = JSON.parse(sessionStorage.getItem("user-info"));
  if (!user_info) {
    return <Navigate to="/" />;
  }

  return (
    <div id="root" className="final-result">
      {result ? (
        <div ref={componentRef} className="final-result-container" id="report">
          <div className="final-resul-main">
            <div className="mark-memo-logo-name-div">
              <div>
                <img
                  className="mark-memo-side-logo"
                  src={logo}
                  alt="university-logo"
                />
              </div>
              <div className="mark-memo-university-heading">
                <h3 className="mark-memo-top-heading-h mark-memo-heading-font">
                  SWAMI RAMANAND TEERTH MARATHWADA UNIVERSITY, NANDED - 431 606.
                </h3>
                <h3 className="mark-memo-top-heading-h mark-memo-heading-font">
                  MAHARASHTRA STATE, INDIA.
                </h3>
                <p className="mark-memo-head-para">
                  Established on 17th September 1994, Recognized By the UGC U/s
                  2(f) and 12(B) NAAC Re-accredited with 'A' Grade{" "}
                </p>
                <h3 className="mark-memo-top-heading-h mark-memo-heading-font">
                  STATEMENT OF MARKS
                </h3>
              </div>
            </div>
            <hr className="style2"></hr>
            <div className="mark-memo-name-and-seat-div">
              <div className="memo-span0-div">
                <span className="memo-name-span">EXAMINATION </span>
                <p className="memo-span0-para">
                  : &#160; MASTER OF COMPUTER APPLICATION{" "}
                  {yearShowinExamination} {semShowninExamination} CBCS,
                  {monthShowinExamination} {monthYearShowinExamination}
                </p>
              </div>
              <div className="memo-span0-div">
                <span className="memo-name-span">COLLAGE NAME </span>
                <p className="memo-span0-para">
                  : &#160; SCHOOL OF COMPUTATIONAL SCIENCES, S.R.T.M.U. NANDED
                </p>
              </div>
              <div className="memo-span0-div">
                <span className="memo-name-span">SEAT NUMBER </span>{" "}
                <p className="memo-span0-para">: &#160; {result.seatno}</p>
              </div>
              <div className="memo-span0-div">
                <span className="memo-name-span">NAME</span>
                <p className="memo-span0-para">: &#160; {result.studentname}</p>
              </div>
            </div>
            <hr className="style2"></hr>
            <div className="mark-memo-papr-title-div">
              <span className="mark-memo-papertitle-span">PAPER TITLE(S) </span>
              <span className="mark-memo-credits-span">CREDITS</span>
              <span className="mark-memo-type-span">TYPE</span>
              <span className="mark-memo-min-max-sapn">
                -----CA-----<span>MAX. MIN. OBT.</span>
              </span>
              <span className="mark-memo-min-max-sapn">
                -----ESE-----<span>MAX. MIN. OBT.</span>
              </span>
              <span className="mark-memo-total-sapn">
                ----TOTAL----<span>MAX. &#160; OBT.</span>
              </span>
              <span className="mark-memo-grd-span">GRD</span>
              <span className="mark-memo-grdpts-span">GRD PTS</span>
              <span className="mark-memo-earnedgrdpts-span">
                EARNED GRD PTS
              </span>
            </div>

            {result?.semester === "II" || result?.semester === "IV" ? (
              <div>
                <hr className="style3"></hr>
                <span>SEMESTER {resultPrevious?.semester}</span>
                <br />
                <br />
              </div>
            ) : (
              <span></span>
            )}

            {/* only for previous semester  */}
            {/* {previousSeatNo !== "" ?(<span></span>):(<span></span>)} */}
            {previousSeatNo !== null ? (
              <div>
                {marksPrevious?.map((mark) => (
                  <div className="mark-memo-papr-title-div">
                    <span className="mark-memo-papertitle-span">
                      {mark.subject.subject_name}
                    </span>
                    <span className="mark-memo-credits-span">
                      {mark.subject.credits}
                    </span>
                    {mark.subject.subject_type !== "OT" ? (
                      <span className="mark-memo-type-span">
                        ({mark.subject.subject_type})
                      </span>
                    ) : (
                      <span className="mark-memo-type-span">&#160;&#160;</span>
                    )}

                    <span className="mark-memo-min-max-sapn-1">
                      <span className="mark-memo-min-max-obt-mark-span">
                        {mark.subject.max_marks}
                      </span>{" "}
                      <span className="mark-memo-min-max-obt-mark-span">
                        {mark.subject.min_marks}
                      </span>
                      <span className="mark-memo-min-max-obt-mark-span">
                        {mark.mark.internal}
                      </span>
                    </span>
                    {mark.subject.subject_type !== "OT" ? (
                      <span className="mark-memo-min-max-sapn-1">
                        <span className="mark-memo-min-max-obt-mark-span">
                          {mark.subject.max_marks}
                        </span>{" "}
                        <span className="mark-memo-min-max-obt-mark-span">
                          {mark.subject.min_marks}
                        </span>
                        <span className="mark-memo-min-max-obt-mark-span">
                          {mark.mark.external}
                        </span>
                      </span>
                    ) : (
                      <span className="mark-memo-min-max-sapn-1">
                        <span className="mark-memo-min-max-obt-mark-span">
                          --
                        </span>
                        <span className="mark-memo-min-max-obt-mark-span">
                          --
                        </span>
                        <span className="mark-memo-min-max-obt-mark-span">
                          --
                        </span>
                      </span>
                    )}
                    <span className="mark-memo-total-sapn-1">
                      {mark.subject.subject_type !== "OT" ? (
                        <span className="mark-memo-tomax-span">
                          {mark.subject.max_marks + mark.subject.max_marks}
                        </span>
                      ) : (
                        <span className="mark-memo-tomax-span">
                          {mark.subject.max_marks}
                        </span>
                      )}
                      <span className="mark-memo-tomax-span">
                        {mark.mark.internal + mark.mark.external}
                      </span>
                    </span>
                    <span className="mark-memo-grd-span">
                      {calculateGrade(
                        mark.mark.internal + mark.mark.external,
                        mark.subject.subject_type
                      )}
                    </span>
                    <span className="mark-memo-grdpts-span">
                      {calculateGradePTS(
                        mark.mark.internal + mark.mark.external,
                        mark.subject.subject_type
                      )}
                    </span>
                    <span className="mark-memo-earnedgrdpts-span">
                      {calculateGradePTS(
                        mark.mark.internal + mark.mark.external,
                        mark.subject.subject_type
                      ) * mark.subject.credits}
                    </span>
                  </div>
                ))}
                <hr className="style3"></hr>
              </div>
            ) : (
              <span></span>
            )}

            {/* end of only for previous sem */}

            <span>SEMESTER {result?.semester}</span>
            <br />
            <br />
            {marks.map((mark) => (
              <div className="mark-memo-papr-title-div">
                <span className="mark-memo-papertitle-span">
                  {mark.subject.subject_name}
                </span>
                <span className="mark-memo-credits-span">
                  {mark.subject.credits}
                </span>
                {mark.subject.subject_type !== "OT" ? (
                  <span className="mark-memo-type-span">
                    ({mark.subject.subject_type})
                  </span>
                ) : (
                  <span className="mark-memo-type-span">&#160;&#160;</span>
                )}

                <span className="mark-memo-min-max-sapn-1">
                  <span className="mark-memo-min-max-obt-mark-span">
                    {mark.subject.max_marks}
                  </span>{" "}
                  <span className="mark-memo-min-max-obt-mark-span">
                    {mark.subject.min_marks}
                  </span>
                  <span className="mark-memo-min-max-obt-mark-span">
                    {mark.mark.internal < 20 ? (
                      <u>{mark.mark.internal}</u>
                    ) : (
                      mark.mark.internal
                    )}
                  </span>
                </span>
                {mark.subject.subject_type !== "OT" ? (
                  <span className="mark-memo-min-max-sapn-1">
                    <span className="mark-memo-min-max-obt-mark-span">
                      {mark.subject.max_marks}
                    </span>{" "}
                    <span className="mark-memo-min-max-obt-mark-span">
                      {mark.subject.min_marks}
                    </span>
                    <span className="mark-memo-min-max-obt-mark-span">
                      {mark.mark.external < 20 ? (
                        <u>{mark.mark.external}</u>
                      ) : (
                        mark.mark.external
                      )}
                    </span>
                  </span>
                ) : (
                  <span className="mark-memo-min-max-sapn-1">
                    <span className="mark-memo-min-max-obt-mark-span">--</span>
                    <span className="mark-memo-min-max-obt-mark-span">--</span>
                    <span className="mark-memo-min-max-obt-mark-span">--</span>
                  </span>
                )}
                <span className="mark-memo-total-sapn-1">
                  {mark.subject.subject_type !== "OT" ? (
                    <span className="mark-memo-tomax-span">
                      {mark.subject.max_marks + mark.subject.max_marks}
                    </span>
                  ) : (
                    <span className="mark-memo-tomax-span">
                      {mark.subject.max_marks}
                    </span>
                  )}
                  <span className="mark-memo-tomax-span">
                    {mark.mark.internal + mark.mark.external}
                  </span>
                </span>

                {mark.mark.external < 20 &&
                mark.subject.subject_type !== "OT" ? (
                  <>
                    <span className="mark-memo-grd-span">
                      <u>FC</u>
                    </span>
                    <span className="mark-memo-grdpts-span">
                      <u>0</u>
                    </span>
                    <span className="mark-memo-earnedgrdpts-span">
                      <u>0</u>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="mark-memo-grd-span">
                      {calculateGrade(
                        mark.mark.internal + mark.mark.external,
                        mark.subject.subject_type
                      )}
                    </span>
                    <span className="mark-memo-grdpts-span">
                      {calculateGradePTS(
                        mark.mark.internal + mark.mark.external,
                        mark.subject.subject_type
                      )}
                    </span>
                    <span className="mark-memo-earnedgrdpts-span">
                      {calculateGradePTS(
                        mark.mark.internal + mark.mark.external,
                        mark.subject.subject_type
                      ) * mark.subject.credits}
                    </span>
                  </>
                )}
              </div>
            ))}
            <hr className="style3"></hr>

            {/* if previus sem available then first div else second div will render */}
            {previousSeatNo !== null ? (
              <div>
                {" "}
                {/*first*/}
                <div className="mark-memo-papr-title-div">
                  <span className="mark-memo-total-span-total">TOTAL</span>
                  <span className="mark-memo-total-credits-span">
                    {totalCredtisPreviousplusCurrent}
                  </span>
                  <span className="mark-memo-total-sapn-1 mark-memo-total-sapn-122">
                    <span className="mark-memo-tomax-span">
                      {totalMarkscurrentplusprevious}
                    </span>
                    <span className="mark-memo-tomax-span">
                      {totalObtcurrentpluspreviousSem}
                    </span>
                  </span>
                  <span> &#160;&#160;</span>
                  <span className="mark-memo-total-grd-pts">
                    {totalGradePointsPreviousplusCurrent}
                  </span>
                  <span>{totalEarnedGradePointsPreviousplusCurrent}</span>
                </div>
                <br />
              </div>
            ) : (
              {
                /*second*/
              }(
                <div>
                  <div className="mark-memo-papr-title-div">
                    <span className="mark-memo-total-span-total">TOTAL</span>
                    <span className="mark-memo-total-credits-span">
                      {totalCredits}
                    </span>
                    <span className="mark-memo-total-sapn-1 mark-memo-total-sapn-122">
                      <span className="mark-memo-tomax-span">
                        {totalMarksMax}
                      </span>
                      <span className="mark-memo-tomax-span">
                        {totalMarksObt}
                      </span>
                    </span>
                    <span> &#160;&#160;</span>
                    <span className="mark-memo-total-grd-pts">
                      {totalGradePoints}
                    </span>
                    <span>{totalEarnedGradePoints}</span>
                  </div>
                  <br />
                </div>
              )
            )}
            {/* end */}

            {result?.semester === "II" || result?.semester === "IV" ? (
              <div className="mark-memo-papr-title-div">
                <span className="mark-memo-totalcreditsearned-span">
                  {" "}
                  TOTAL CREDITS EARNED{" "}
                </span>
                <span className="mark-memo-totalcreditsearned-span-credits">
                  {totalCredtisPreviousplusCurrent}
                </span>
                <span>
                  CPI [ SEMESTER - {resultPrevious?.semester} &{" "}
                  {result?.semester} ] :&#160;{" "}
                  {(
                    totalEarnedGradePointsPreviousplusCurrent /
                    totalCredtisPreviousplusCurrent
                  ).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="mark-memo-papr-title-div">
                <span className="mark-memo-totalcreditsearned-span">
                  {" "}
                  TOTAL CREDITS EARNED{" "}
                </span>
                {result?.marks
                  .filter((mark) => mark.subject.subject_type !== "OT")
                  .some((mark) => mark.mark.external < 20) ? (
                  <span className="mark-memo-totalcreditsearned-span-credits">
                    ---
                  </span>
                ) : (
                  <span className="mark-memo-totalcreditsearned-span-credits">
                    {totalCredits}
                  </span>
                )}
                {result?.marks
                  .filter((mark) => mark.subject.subject_type !== "OT")
                  .some((mark) => mark.mark.external < 20) ? (
                  <span>SPI [ SEMESTER - {result?.semester} ] : 0.00 </span>
                ) : (
                  <span>
                    SPI [ SEMESTER - {result?.semester} ] :{" "}
                    {(totalEarnedGradePoints / totalCredits).toFixed(2)}
                  </span>
                )}
              </div>
            )}

            <hr className="style3"></hr>
            <br />
            <div>
              <span>DATE : MAY 04, 2022</span>
            </div>
            <br />
            <div className="mark-memo-last-sign-div">
              <span className="mark-memo-last-note-span">
                TH THEORY, PR: PRACTICAL (CA-ESE) IE : INTERNAL EXAM, SEMI :
                SEMINAR, OR : ORAL, T : TEST, TW: TERM WORK, TTW : TEST+TW, AA :
                ABSENT, EXEMPTED, GRACE, AVAILED/04, MCQ : MULTIPLE CHOICE
                QUESTION, PC : PERFORMANCE CANCELLED. WPC : WHOLE PERFORMANCE
                CANCELLED, CA : CONTINUOUS ASSESSMENT, ESE : END OF SEMESTER
                EXAMINATION, THIS STATEMENT IS SUBJECT TO CORRECTIONS, IF ANY
              </span>
              <span className="mark-memo-sign-span">
                <img
                  className="mark-memo-director-sign-img"
                  src={sign}
                  alt=""
                />
                <span>DIRECTOR</span>
                <span className="mark-memo-last-director-span">
                  Board of Examination & Evaluation
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p>No result found</p>
      )}
      <br />
      <div className="mark-memo-print-result-btn-div">
        <button
          type="button"
          className="btn btn-primary btn-save-as-print"
          onClick={handlePrint}
        >
          <TfiPrinter size={18} /> &#160; PRINT
        </button>
        <span className="mark-memo-note-for-printing-span">
          <span className="mark-memo-note-for-printing-span-bold-note">
            *Note : Please Select the Layout - Portrait and Page Size - A3*
          </span>
          (Selecting the appropriate page size and layout is crucial to ensuring
          that your printed document looks polished and is easy to read)
        </span>
      </div>
      <div>
        {loading ? (
          <Backdrop
            sx={{
              color: "#ffffff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "rgb(0,0,0,0.8)",
            }}
            open
          >
            <HashLoader color="#1fcb4f" />
          </Backdrop>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default UserResult;
