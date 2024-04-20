const axios = require('axios');
// for file upload
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { getAccessToken } = require('../accessToken');

let access_token = "";

// Get All leads from CRM
exports.getData = async (req, res) => {
    // Generating access Token
    access_token = await getAccessToken();

    const config = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        url: "https://www.zohoapis.com/crm/v2/Leads"
    };

    axios.request(config)
        .then((result) => {
            const leads = result.data.data;
            console.log('fetched leads', leads);

            // filtering the leads
            const data = leads.filter((lead) => {
                return !(lead.Status === 'Approve' || lead.Status === 'Reject');
            })

            // sending data to frontend
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log('error ---------->', err);
            res.status(500).json(err);
        });
}

// approve record
exports.approveRecord = async (req, res) => {
    // Generating access Token
    access_token = await getAccessToken();

    const { leadId } = req.params;
    console.log(leadId);

    const updatedData = [
        {
            id: leadId,
            Status: "Approve"
        }
    ];


    const config = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        url: `https://www.zohoapis.com/crm/v2/Leads/${leadId}`,
        data: {
            data: updatedData
        }
    }

    axios.request(config)
        .then((result) => {
            const data = result.data.data;
            console.log('fetched data', data);

            // sending data to frontend
            res.status(200).json({
                success: true,
                message: 'Record Status changed to approve'
            });
        })
        .catch((err) => {
            console.log('error ---------->', err);
            res.status(500).json({
                success: false,
                message: 'Error updating record'
            });
        });

}

// reject record
exports.rejectRecord = async (req, res) => {
    // Generating access Token
    access_token = await getAccessToken();

    const { leadId } = req.params;
    console.log(leadId);

    const updatedData = [
        {
            id: leadId,
            Status: "Reject"
        }
    ];


    const config = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        url: `https://www.zohoapis.com/crm/v2/Leads/${leadId}`,
        data: {
            data: updatedData
        }
    };

    axios.request(config)
        .then((result) => {
            const data = result.data.data;
            console.log('fetched data', data);

            res.status(200).json({
                success: true,
                message: 'Record Status changed to reject'
            });
        })
        .catch((err) => {
            console.log('error ---------->', err);
            res.status(500).json({
                success: false,
                message: 'Error updating record'
            });
        });

}


// search
exports.searchRecordByMail = async (req, res, next) => {
    // Generating access Token
    access_token = await getAccessToken();

   const mail = req.body.email;

   const config = {
       method: "GET",
       headers: {
           'Authorization': `Bearer ${access_token}`
       },
       url: `https://www.zohoapis.com/crm/v5/Leads/search?email=${mail}`,
   }

   const response = await axios.request(config);
   const recordId = await response?.data?.data?.[0]?.id;


   // If record doesn't exist then create a new record
   if (!recordId) {
       try {
           const { name, email, phone } = req.body;
           console.log("Received Data -->", name, email, phone);

           // newlead fields
           const newLead = [
               {
                   Lead_Source: "Others",
                   Product: "DM Migrate",
                   "Designation-": "test",
                   "Last_Name": name,
                   "First_Name": name,
                   Email: email,
                   Phone: phone,
               },
           ];

           // options
           const config = {
               method: "POST",
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${access_token}`
               },
               url: `https://www.zohoapis.com/crm/v2/Leads`,
               data: {
                   data: newLead,
               }
           }

           // creating new lead/record
           const response = await axios.request(config);
           const data = await response.data.data[0];
           console.log('created lead', data);

           // calling next middleware after attaching recordId
           const recordId = data?.details?.id
           console.log("recordId", recordId);
           req.recordId = recordId;
        //    next();
            res.status(200).json({
                success: true,
                message: "Lead Created Successfully"
            });
       }
       catch (err) {
           return res.status(500).json({
               success: false,
               message: 'error creating new Record'
           });
       }
   }

   // If record already exists, attach record Id with req. object
  else{
    // calling next middleware after attaching recordId
    req.recordId = recordId;
    // next();
    res.status(409).json({
        success: false,
        message: "Lead already exits"
    });
  }
}

exports.uploadAttachment = async (req, res) => {
   try {
       const recordId = req.recordId;
       const file = req.files.file;

       // creating path where file will be stored
       const uploadPath = path.resolve(__dirname, "../docs", file.name);
       console.log("uploadPath", uploadPath);

       // saving file on server
       await file.mv(uploadPath, function (err) {
           if (err) {
               return res.status(500).send(err);
           }
       });
       console.log("file saved on the server");

       // creating formData 
       const fileData = new FormData();
       fileData.append('file', fs.createReadStream(uploadPath));
       fileData.append('title', file.name);

       // options
       const config = {
           method: "POST",
           maxBodyLength: Infinity,
           headers: {
               'Authorization': `Bearer ${access_token}`,
               ...fileData.getHeaders()
           },
           url: `https://www.zohoapis.com/crm/v5/Leads/${recordId}/Attachments`,
           data: fileData
       }

       console.log("here");

        // uploading file to CRM
       setTimeout(async () => {
               const responsee = await axios.request(config);
               const data = await responsee?.data?.data?.[0];
               console.log("response after uploading file", data);

               console.log("there");

               res.status(200).json({
                   success: false,
                   message: "document uploaded successfully"
               });
       }, 100);
   }

   catch (err) {
       console.log("error -->", err);
       res.status(400).json({
           success: false,
           message: "error uploading document"
       });
   }
}
