const HOST = 'https://test.v5.pryaniky.com';

export const login = async (username: string, password: string) => {
    const response = await fetch(`${HOST}/ru/data/v3/testmethods/docs/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
};

export const fetchData = async (token: string) => {
    const response = await fetch(`${HOST}/ru/data/v3/testmethods/docs/userdocs/get`, {
        headers: {
            'x-auth': token,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data.data;
};

interface DataItem {
    id?: string;
    companySigDate: string;
    companySignatureName: string;
    documentName: string;
    documentStatus: string;
    documentType: string;
    employeeNumber: string;
    employeeSigDate: string;
    employeeSignatureName: string;
}

export const createData = async (token: string, newData: DataItem) => {
    const response = await fetch(`${HOST}/ru/data/v3/testmethods/docs/userdocs/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth': token,
        },
        body: JSON.stringify(newData),
    });

    if (!response.ok) {
        throw new Error('Failed to create data');
    }

    return await response.json();
};

export const updateData = async (token: string, id: string, updatedData: DataItem) => {
    const response = await fetch(`${HOST}/ru/data/v3/testmethods/docs/userdocs/set/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth': token,
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        throw new Error('Failed to update data');
    }

    return await response.json();
};

export const deleteData = async (token: string, id: string) => {
    const response = await fetch(`${HOST}/ru/data/v3/testmethods/docs/userdocs/delete/${id}`, {
        method: 'POST',
        headers: {
            'x-auth': token,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete data');
    }

    return await response.json();
};