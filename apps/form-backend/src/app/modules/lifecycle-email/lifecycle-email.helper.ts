import { uniqBy } from 'lodash.uniq';
import { returnKeys } from '../company/helper/company.helper';
import { formatDate } from '../../helpers/date.helper';
import { ClientDto } from '../wealthbox/dto/client.dto';
import { CompanyDto } from '../company/dto/company.dto';

export function returnClientInfo(client: ClientDto) {
    const keys = returnKeys();
    const clientKeys = keys['client'];
    const driverKeys = keys['drivers'];
    const vehicleKeys = keys['vehicles'];
    const homeKeys = keys['homes'];
    const businessKeys = keys['business'];

    function returnUniqRows(rows) {
        return uniqBy(rows, 'label');
    }

    const rows = [];

    const datesArray = ['birthDate', 'priorPenaltiesDate', 'spouseBirthdate', 'priorInsuranceExpirationDate',
    'priorInsuranceStartDate', 'accidentDate', 'compLossDate', 'homeLossDate', 'entityStartDate', 'purchaseDate',
    'moveInDate', 'windMitigationInspectionDate', 'plumbingUpdateDate', 'purchaseDate', 'priorOdometerReadingDate', 'effectiveDate',
    'currentOdometerReadingDate', 'applicantBirthDt', 'driverLicensedDt', 'priorPenaltiesDate', 'hireDate','createdAt', 'updatedAt'];

    rows.push({ label: 'General Info', value: '' });
    for (const [key] of Object.entries(clientKeys)) {
        if (client[key]) {
            const isDate = datesArray.includes(key);
            const row = {label: clientKeys[key], value: isDate ? formatDate(client[key]) : client[key] || 'Not Completed'};
            rows.push(row);
        }
    }

    if (Object.prototype.hasOwnProperty.call(client, 'drivers') && client.drivers.length > 0) {
        rows.push({ label: 'Drivers', value: '' });
        client.drivers.forEach((driver, i) => {
            rows.push({ label: 'Driver', value: i+1 });
            for (const [key] of Object.entries(driverKeys)) {
                if (driver[key]) {
                    const isDate = datesArray.includes(key);
                    const row = {label: driverKeys[key], value: isDate ? formatDate(driver[key]) : driver[key] || 'Not Completed'};
                    rows.push(row);
                }
            }
        })
    }

    if (Object.prototype.hasOwnProperty.call(client, 'vehicles') && client.vehicles.length > 0) {
        rows.push({ label: 'Vehicles', value: '' });
        client.vehicles.forEach((vehicle, i) => {
            rows.push({ label: 'Vehicle', value: i+1 });
            for (const [key] of Object.entries(vehicleKeys)) {
                if (vehicle[key]) {
                    const isDate = datesArray.includes(key);
                    const row = {label: vehicleKeys[key], value: isDate ? formatDate(vehicle[key]) : vehicle[key] || 'Not Completed'};
                    rows.push(row);
                }
            }
        })
    }

    if (Object.prototype.hasOwnProperty.call(client, 'homes') && client.homes.length > 0) {
        rows.push({ label: 'Home', value: '' });
        for (const [key] of Object.entries(homeKeys)) {
            if (client.homes[0][key]) {
                const isDate = datesArray.includes(key);
                const row = {label: homeKeys[key], value: isDate ? formatDate(client.homes[0][key]) : 
                            client.homes[0][key] || 'Not Completed'};
                rows.push(row);
            }
        }
    }

    if (Object.prototype.hasOwnProperty.call(client, 'business') && client.businesses) {
        rows.push({ label: 'Commercial', value: '' });
        for (const [key] of Object.entries(businessKeys)) {
            if (client.businesses[key]) {
                const isDate = datesArray.includes(key);
                const row = {label: businessKeys[key], value: isDate ? formatDate(client.businesses[key]) : client.businesses[key] || 'Not Completed'};
                rows.push(row);
            }
        }
    }

    return returnUniqRows(rows);
}

export const returnHasStyledEmail = (form) => {
    if (form.styleEmail) {
        return `<style>
        .background {
            background-color: #fff;
            height: auto;
            width: 830px;
            padding: 30px;
        }
        
        body {
            font-family: sans-serif;
        }
        
        .view-client-link {
            color: #fff;
            text-decoration: none;
        }
        
        .login-link {
            color: #111;
        }
        
        .container {
            display: block;
            background: #FFFFFF;
            align-content: center;
            height: auto;
            width: 750px;
            padding: 15px;
            /*display: inline-block;*/
            border-radius: 10px;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
        }
        
        .logo {
            display: block;
            margin-right: auto;
            margin-left: auto;
            margin-top: 7%;
            margin-bottom: 7%;
            width: 75px;
        }
        
        .header {
            color: #999;
            font-family: sans-serif;
            font-size: 35px;
        }
        
        .content {
            font-family: sans-serif;
            font-size: 24px;
            padding: 6px;
            line-height: 1.8;
        }
        
        .contact-box {
            align-content: center;
            width: 300px;
            display: block;
            margin-top: 10px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .contact {
        font-family: sans-serif;
            font-size: 25px;
            padding: 5px;
            text-align: left;
            alignment: center;
            line-height: 1;
        }
        
        .button {
            border-radius: 15px;
            background: #7C7FFF;
            color: #FFFFFF;
            display: inline-block;
            font-family: sans-serif;
            font-size: 23px;
            font-weight: 800;
            width: 230px;
            padding: 8px;
            height: 70px;
            margin-bottom: 90px;
            margin-top: 15px;
        }
        
        .address {
            font-family: sans-serif;
            color: #555;
            line-height: 0.8;
            font-size: 17px;
        }
        
        .nav-bar {
            display: block;
            width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        ul#nav li {
            margin-top: 30px;
            margin-right: 40px;
            list-style: none;
            font-family: sans-serif;
            font-size: 17px;
        }
        
        ul#nav li:after {
            content: '|';
            color: #999;
            margin-left: 40px;
        }
        
        ul#nav > li:last-child:after {
            content: '';
            margin-left: 0;
        }
        
        .info-label {
            font-size: 16px;
        }
        
        .info {
            font-size: 14px;
        }
        
        .info-label-container {
            display: inline-block;
        }
        
        @media (max-width: 900px) {
            .logo {
                width: 100px;
            }
        }

    </style>`
    } else {
        return '';
    }
}

export const returnAssignedLeadEmail = async (client: ClientDto, company: CompanyDto, form: any) => {
    if (!form) {
        form = {
            styleEmail: true,
            title: 'Unknown'
        }
    }

    function returnExists(value) {
        if ((value && typeof value != 'undefined' && value !== 'undefined') || value === false) {
            return true;
        }
        return false;
    }

    function returnLeadName() {
        if (returnExists(client.firstName) && returnExists(client.lastName)) {
            return `${client.firstName} ${client.lastName}`;
        } else if (Object.prototype.hasOwnProperty.call(client, 'drivers') && client.drivers.length > 0 && 
          returnExists(client.drivers[0].applicantGivenName) && returnExists(client.drivers[0].applicantSurname)) {
            return `${client.drivers[0].applicantGivenName} ${client.drivers[0].applicantSurname}`;
        }
        return 'Not Completed';
    }

    async function returnEmail() {
        return `
        <!DOCTYPE html>
            <html lang="en">
                ${returnHasStyledEmail(form)}
                <body>
                    <div class="background">
                    ${form.styleEmail ? `<img class="logo" style="max-height: 75px" src="${company.logo}">` : ''}
                        <div class="container">
                            <h1 class="header">
                                You've Been Assigned A New Lead
                            </h1>
                            <div class="content">
                                You've been assigned a new lead! Please visit the <a href="https://dashboard.xilo.io">XILO</a> platform to view the lead 
                            </div>
                            <div class="contact-box">
                                <div class="contact">
                                <p>
                                Name: ${returnLeadName()}
                                </p>
                                <p>
                                    Phone:  <a href="tel:${client.phone}">${client.phone}</a>
                                </p>
                                <p>
                                    Email:  <a href="mailto:${client.email}">${client.email}</a>
                                </p>
                                ${(client.ezlynxUrl) ? `<p>View on EZLynx: <a href="${client.ezlynxUrl}">Click Here To Visit Prospect On EZlynx</a></p>` : ''}
                                ${(client.clientAgentId) ? `<p>View on XILO: <a href="https://dashboard.xilo.io/agent/clients-table/view/${client.id}/client">Click Here To Visit Prospect On XILO</a></p>` 
                                : `<p>View on XILO: <a href="https://dashboard.xilo.io/profile/prospects/view/${client.id}/client">Click Here To Visit Prospect On XILO</a></p>`}
                                <p>Form: ${form.title}</p> 
                                <br>
                                <hr>
                                <p> Client Information </p>
                                    ${await returnClientInfo(client)}
                                </div>
                            </div>
                            <div class="address">
                                <p>
                                    This email was sent by XILO regarding a lead you were assigned
                                </p>
                                <p>
                                    ${company.mainLocation}
                                </p>
                            </div>
                            <div class="nav-bar">
                                <ul id="nav">
                                    <li>
                                        <a class="login-link" href="https://dashboard.xilo.io/auth/agent-login">VISIT XILO</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `;
    }

    const email = await returnEmail();
    return email;
}