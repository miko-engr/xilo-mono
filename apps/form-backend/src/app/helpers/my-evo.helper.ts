
export const returnData = async (clients) => {
  try {
    const dataObj = []
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i]
      const clientObj = {}
      const assignObject = async (value, label) => {
        if (value && typeof value !== 'undefined') {
          clientObj[label] = value
        }
        return null
      }
      const name = client.fullName ? client.fullName : `${client.firstName} ${client.lastName}`
      await assignObject(name, 'Name')
      if (client.business) {
        await assignObject(client.businesses.entityName, 'AlphaName')
      }
      if (client.postalCd) {
        await assignObject(client.streetAddress, 'Addres1')
        await assignObject(client.unitNumber, 'Address2')
        await assignObject(client.city, 'City')
        await assignObject(client.stateCd, 'State')
        await assignObject(client.postalCd, 'Zip')
      } else if (client.businesses && client.businesses.zipCode) {
        await assignObject(client.businesses.streetAddress, 'Addres1')
        await assignObject(client.businesses.unitNumber, 'Address2')
        await assignObject(client.businesses.city, 'City')
        await assignObject(client.businesses.state, 'State')
        await assignObject(client.businesses.zipCode, 'Zip')
      }
      await assignObject(client.phone, 'Phone1')
      await assignObject(client.email, 'Email')
      dataObj.push(clientObj)
    }

    return { data: dataObj, status: true }
  } catch (error) {
    return { status: false, error: error }
  }
}
