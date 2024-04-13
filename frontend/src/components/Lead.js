import React from "react";
import axios from "axios";

function Lead({ record }) {
  // update lead status to approve in CRM
  const approveRecord = async (leadId) => {
    console.log("approve is clicked", leadId);
    const config = {
      method: "PUT",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      url: `http://localhost:9000/api/v1/updateRecord/approve/${leadId}`,
    };

    axios(config)
      .then((response) => {
        const data = response.data;
        console.log(data);
        alert("Record is updated");
      })
      .catch((error) => {
        console.log("error", error.message);
        alert("error");
      });
  };


  // update lead status to reject in CRM
  const rejectRecord = async (leadId) => {
    console.log("Reject is clicked", leadId);
    const config = {
      method: "PUT",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      url: `http://localhost:9000/api/v1/updateRecord/reject/${leadId}`,
    };

    axios(config)
      .then((response) => {
        const data = response.data;
        console.log(data);
        alert("Record is updated");
      })
      .catch((error) => {
        console.log("error", error.message);
        alert("error");
      });
  };


  return (
    <tr>
      <td className="border-2 px-2 py-1">{record.Full_Name}</td>
      <td className="border-2 px-2 py-1">{record.Email}</td>
      <td className="border-2 px-2 py-1">{record.Phone}</td>
      <td className="border-2 px-2 py-1 flex gap-2">
        <button
          id="approve"
          className="bg-red-700 text-white p-1"
          onClick={() => approveRecord(record.id)}
        >
          Approve
        </button>
        <button
          id="reject"
          className="bg-green-800 text-white p-1"
          onClick={() => rejectRecord(record.id)}
        >
          Reject
        </button>
      </td>
    </tr>
  );
}

export default Lead;
