import { Injectable } from '@angular/core';
import { ContractDetails, AccountDetails, ContractCompany } from './models/account-details.model';
import { PaymentDetails } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {
    newAccount: AccountDetails = { 
        company: {}, 
        contract: {}, 
        payment: new PaymentDetails(), 
        selectedApis: [], 
        selectedForms: []
    };

    constructor() {}
    
    /*
      Account Details
    */
    getAccountDetails() {
        let accountDetails: AccountDetails = JSON.parse(sessionStorage.getItem('accountDetails'));
        if (!accountDetails) {
          accountDetails = this.makeCopy(this.newAccount);
        }
        return accountDetails;
    }

    addAccountDetails(accountDetails: AccountDetails) {
      sessionStorage.setItem('accountDetails', JSON.stringify(accountDetails));
    }

    deleteAccountDetails() {
        sessionStorage.clear();
    }

    /*
      Contract Details
    */
    getContractDetails() {
        const accountDetails: AccountDetails = JSON.parse(sessionStorage.getItem('accountDetails'));
        let contractDetails = {};
        if (accountDetails && accountDetails.contract) {
          contractDetails = accountDetails.contract;
        }
        return contractDetails;
    }

    addContractDetails(contractDetails: ContractDetails) {
        let accountDetails = sessionStorage.getItem('accountDetails');
        const newDetails: ContractDetails = contractDetails;
        if (accountDetails) {
            accountDetails = JSON.parse(accountDetails);
        } else {
            accountDetails = this.makeCopy(this.newAccount);
        }
        accountDetails['contract'] = newDetails;
        sessionStorage.setItem('accountDetails', JSON.stringify(accountDetails));
    }

    deleteContractDetails() {
        const accountDetails = JSON.parse(sessionStorage.getItem('accountDetails'));
        delete accountDetails.contract;
        sessionStorage.setItem('accountDetails', JSON.stringify(accountDetails));
    }

    /*
      Company Details
    */
    getCompanyDetails() {
        const accountDetails: AccountDetails = JSON.parse(sessionStorage.getItem('accountDetails'));
        let companyDetails = {};
        if (accountDetails && accountDetails.company) {
          companyDetails = accountDetails.company;
        }
        return companyDetails;
    }

    addCompanyDetails(companyDetails: ContractCompany) {
        let accountDetails = sessionStorage.getItem('accountDetails');
        const newDetails: ContractCompany = companyDetails;
        if (accountDetails) {
            accountDetails = JSON.parse(accountDetails);
        } else {
            accountDetails = this.makeCopy(this.newAccount);
        }
        accountDetails['company'] = newDetails;
        sessionStorage.setItem('accountDetails', JSON.stringify(accountDetails));
    }

    deleteCompanyDetails() {
        const accountDetails = JSON.parse(sessionStorage.getItem('accountDetails'));
        delete accountDetails.company;
        sessionStorage.setItem('accountDetails', JSON.stringify(accountDetails));
    }

    /*
      Payment Details
    */
    getPaymentDetails() {
        const accountDetails: AccountDetails = JSON.parse(sessionStorage.getItem('accountDetails'));
        let paymentDetails = {};
        if (accountDetails && accountDetails.payment) {
          paymentDetails = accountDetails.payment;
        }
        return paymentDetails;
    }

    addPaymentDetails(paymentDetails: PaymentDetails) {
        let accountDetails = sessionStorage.getItem('accountDetails');
        const newDetails: PaymentDetails = paymentDetails;
        if (accountDetails) {
            accountDetails = JSON.parse(accountDetails);
        } else {
            accountDetails = this.makeCopy(this.newAccount);
        }
        accountDetails['payment'] = newDetails;
        sessionStorage.setItem('accountDetails', JSON.stringify(accountDetails));
    }

    deletePaymentDetails() {
        const accountDetails = JSON.parse(sessionStorage.getItem('accountDetails'));
        delete accountDetails.payment;
        sessionStorage.setItem('accountDetails', JSON.stringify(accountDetails));
    }

    makeCopy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }
}