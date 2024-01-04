
export class ApiService {
    BASE_API_URL = "https://api.bastionwallet.io";


    async createDapp(apiKey: string, dappName: string): Promise<string> {
        try {
            const payload = { dappName };
            const headers = {
                "x-api-key": apiKey,
                'Accept': 'application/json',
                  'Content-Type': 'application/json'
            };
            const endpoint = `/v1/dapp/create`
            const response = await fetch(`${this.BASE_API_URL}${endpoint}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers
            });
            const res = await response.json();
            if(res.statusCode === "10001") throw new Error(res.message);
            const dappData = res?.data;
    
            return dappData;
        } catch (e) {
            throw new Error(`Error while getting sponsorship, reason: ${e.response.data.message}`);
        }
    }

    async deleteDapp(apiKey: string, dappId: string): Promise<string> {
        try {
            const payload = { dappId };
            const headers = {
                "x-api-key": apiKey,
                'Accept': 'application/json',
                  'Content-Type': 'application/json'
            };
            const endpoint = `/v1/dapp/delete`
            const response = await fetch(`${this.BASE_API_URL}${endpoint}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers
            });
            const res = await response.json();
            if(res.statusCode === "10001") throw new Error(res.message);
            const dappData = res?.data;
    
            return dappData;
        } catch (e) {
            throw new Error(`Error while getting sponsorship, reason: ${e.response.data.message}`);
        }
    }

    async getDapp(apiKey: string, dappId: string) : Promise<any> {
        try {
            const query = { dappId };
            const headers = {
                "x-api-key": apiKey,
                'Accept': 'application/json',
                  'Content-Type': 'application/json'
            };
            const endpoint = `/v1/dapp/get`
            const response = await fetch(`${this.BASE_API_URL}${endpoint}?${query}`, {
				method: "GET",
				headers,
			});

            const res = await response.json();
            if(res.statusCode === "10001") throw new Error(res.message);
            const dappData = res?.data;
    
            return dappData;
        } catch (e) {
            throw new Error(`Error while getting sponsorship, reason: ${e.response.data.message}`);
        }
    }

    async createSubscription(apiKey: string, amount: number, validAfter: Date, validUntil: Date, initiatorAddress: String, subscriberAddress: String, paymentInterval: number, paymentLimit : number) : Promise<any>{
        try {
            const payload = { amount, validAfter, validUntil, initiatorAddress, subscriberAddress, paymentInterval, paymentLimit };
            const headers = {
                "x-api-key": apiKey,
                'Accept': 'application/json',
                  'Content-Type': 'application/json'
            };
            const endpoint = `/v1/subscription/create`
            const response = await fetch(`${this.BASE_API_URL}${endpoint}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers
            });
            const res = await response.json();
            if(res.statusCode === "10001") throw new Error(res.message);
            const dappData = res?.data;
    
            return dappData;
        } catch (e) {
            throw new Error(`Error while getting sponsorship, reason: ${e.response.data.message}`);
        }
    }

    async getSubscription(apiKey: string, subscriptionId: string): Promise<any>{
        try {
            const query = { subscriptionId };
            const headers = {
                "x-api-key": apiKey,
                'Accept': 'application/json',
                  'Content-Type': 'application/json'
            };
            const endpoint = `/v1/subscription/get`
            const response = await fetch(`${this.BASE_API_URL}${endpoint}?${query}`, {
				method: "GET",
				headers,
			});

            const res = await response.json();
            if(res.statusCode === "10001") throw new Error(res.message);
            const dappData = res?.data;
    
            return dappData;
        } catch (e) {
            throw new Error(`Error while getting sponsorship, reason: ${e.response.data.message}`);
        }
    }

    async deleteSubscription(apiKey: string, subscriptionId: string) : Promise<any>{
        try {
            const payload = { subscriptionId };
            const headers = {
                "x-api-key": apiKey,
                'Accept': 'application/json',
                  'Content-Type': 'application/json'
            };
            const endpoint = `/v1/subscription/delete`
            const response = await fetch(`${this.BASE_API_URL}${endpoint}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers
            });
            const res = await response.json();
            if(res.statusCode === "10001") throw new Error(res.message);
            const dappData = res?.data;
    
            return dappData;
        } catch (e) {
            throw new Error(`Error while getting sponsorship, reason: ${e.response.data.message}`);
        }
    }


}

