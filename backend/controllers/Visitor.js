const axios = require("axios");
const path = require("path");
const FormData = require("form-data");
const fs = require("fs");
const { getAccessToken } = require('../accessToken');

let access_token = "";

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
            next();
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
     next();
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