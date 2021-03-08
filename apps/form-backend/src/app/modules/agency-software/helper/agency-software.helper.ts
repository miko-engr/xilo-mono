export async function returnData(clients) {
  try {
    const dataObj = [];
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      async function assignObject(value, label) {
        if (value && typeof value != 'undefined') {
          clientObj[label] = value;
        }
        return null;
      }
      const clientObj = {};
      await assignObject(client.firstName, 'first_name');
      await assignObject(client.lastName, 'last_name');
      await assignObject(client.fullName, 'full_name');
      await assignObject(client.business.entityName, 'company_name');
      if (client.postalCd) {
        await assignObject(client.streetAddress, 'address');
        await assignObject(client.unitNumber, 'address2');
        await assignObject(client.city, 'city');
        await assignObject(client.stateCd, 'state');
        await assignObject(client.postalCd, 'zip');
      } else if (client.business && client.business.zipCode) {
        await assignObject(client.business.streetAddress, 'address');
        await assignObject(client.business.unitNumber, 'address2');
        await assignObject(client.business.city, 'city');
        await assignObject(client.business.state, 'state');
        await assignObject(client.business.zipCode, 'zip');
      }
      await assignObject(client.phone, 'cell');
      await assignObject(client.email, 'email');
      // await assignObject(client.email, 'csr');
      if (client.agent && client.agent.firstName) {
        const name = `${client.agent.firstName}${
          client.agent.lastName ? ` ${client.agent.lastName}` : ''
        }`;
        await assignObject(name, 'producer');
      }
      await assignObject(client.business.entityType, 'type');
      dataObj.push(clientObj);
    }

    return { data: dataObj, status: true };
  } catch (error) {
    return { status: false, error: error };
  }
}
