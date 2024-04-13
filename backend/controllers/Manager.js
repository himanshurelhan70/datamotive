const axios = require('axios');
// for file upload
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { getAccessToken } = require('../accessToken');

let access_token = "";
let users_access_token = "";


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

