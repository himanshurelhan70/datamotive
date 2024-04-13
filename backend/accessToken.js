const fs = require("fs");
const axios = require("axios");

exports.getAccessToken = async () => {
    try {
        // reading file Data
        const readFile = fs.readFileSync("accessToken.txt", "utf-8");
        const fileData = JSON.parse(readFile);
        const storedTime = new Date(fileData.expiresAt);
        // console.log("fileData", fileData);

        // runs when token expires or doesn't exist
        if (
            new Date().getTime() > storedTime.getTime() ||
            fileData.token === "" ||
            fileData.token === undefined ||
            fileData.expiresAt === "" ||
            fileData.expiresAt === undefined
        ) {
            // adding 55 minutes to current time
            var d = new Date();
            d.setMinutes(d.getMinutes() + 55);

            // generating ZOHO access token
            const response = await axios.post(
                "https://accounts.zoho.com/oauth/v2/token",
                {},
                {
                    params: {
                        refresh_token: "1000.0b4ea526839b4e09ed5e3d301016d2e3.a7de315626882a61cdbb1d196b80ef0e",
                        client_id: "1000.HVC0WDHGUXLC9V7M3JEY0G6XICHMIN",
                        client_secret: "e50bc5f3ad8d6382c1f5b143e86b9f52401a60b96b",
                        grant_type: "refresh_token",
                    },
                }
            );

            const newToken = response.data.access_token;

            // Storing Token in accessToken.txt file
            fs.writeFileSync(
                "accessToken.txt",
                JSON.stringify({
                    token: newToken,
                    expiresAt: d,
                }, null, 2),
                "utf8"
            );

            console.log("New token", newToken);
            return newToken;
        } 
        // runs when token exist and expires
        else {
            console.log("fileData", fileData);
            return fileData.token;
        }
    } catch (err) {
        console.log(err);
        return err.message;
    }
};

