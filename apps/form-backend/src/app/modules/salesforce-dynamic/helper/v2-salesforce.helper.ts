//Call apex rest service(Not in use at the moment)
export const execute_sf_restful_service = function (service, data, callback) {
  conn.apex.post(service, data, function (err, result) {
    callback(result, err);
  });
};

//Execute SOQL query so we can check if record exist
export const execute_sf_api_query = function (query) {
  conn.query(query, function (err, result) {
    if (err) {
      if (
        Array.isArray(err) &&
        err[0].message &&
        err[0].message == 'Session expired or invalid'
      ) {
        refreshTokenOnError();
      }
      return console.error(err);
    }
    console.log('total : ' + result.totalSize);
    console.log('fetched : ' + result.records.length);
  });
};

//Upsert record based on ID
export const upsertObj = function (objName, valueJson) {
  conn.sobject(objName).upsert(
    {
      Name: valueJson.name,
      Id: valueJson.Id,
    },
    'Id',
    function (err, ret) {
      if (err || !ret.success) {
        if (
          Array.isArray(err) &&
          err[0].message &&
          err[0].message == 'Session expired or invalid'
        ) {
          refreshTokenOnError();
        }
        return console.error(err, ret);
      }
      console.log('Upserted Successfully');
    }
  );
};

//Upload file to any record.
export const uploadFile = function (recordId, fileName, content, callback) {
  const jsonData = {
    VersionData: content,
    Title: fileName,
    FirstPublishLocationId: recordId,
    PathOnClient: fileName,
  };

  conn.sobject('ContentVersion').create(jsonData, function (err, ret) {
    if (err || !ret.success) {
      if (
        Array.isArray(err) &&
        err[0].message &&
        err[0].message == 'Session expired or invalid'
      ) {
        refreshTokenOnError();
      }
      console.error(err, ret);
    }
    console.log('Upserted Successfully');
    callback(ret, err);
  });
};

//This function will query data and if found it will update.
export const queryAndUpsert = function (query, objToUpsert, objName) {
  conn.query(query, function (err, result) {
    if (err) {
      if (
        Array.isArray(err) &&
        err[0].message &&
        err[0].message == 'Session expired or invalid'
      ) {
        refreshTokenOnError();
      }
      return console.error(err);
    }
    if (result && result.records) {
      if (result.records.length > 0) {
        objToUpsert.Id = result.records[0].Id;
        conn.sobject(objName).update(objToUpsert, function (err, ret) {
          if (err || !ret.success) {
            return console.error(err, ret);
          }
          console.log('Update Successfully');
        });
      } else {
        conn.sobject(objName).insert(objToUpsert, function (err, ret) {
          if (err || !ret.success) {
            return console.error(err, ret);
          }
          console.log('Inserted Successfully');
        });
      }
    }
  });
};

//Get fields of particular object.
export const describeSobJect = function (objName, callback) {
  console.log(objName);
  conn.sobject(objName).describe(function (err, meta) {
    if (err) {
      if (
        Array.isArray(err) &&
        err[0].message &&
        err[0].message == 'Session expired or invalid'
      ) {
        refreshTokenOnError();
      }
      return console.error(err);
    }

    const jsonData = {};
    jsonData['objName'] = objName;
    jsonData['fields'] = meta.fields;

    callback(jsonData, err);
  });
};

//Get list of all sobjects.
export const getAllSobject = function (callback) {
  conn.describeGlobal(function (err, res) {
    if (err) {
      if (
        Array.isArray(err) &&
        err[0].message &&
        err[0].message == 'Session expired or invalid'
      ) {
        refreshTokenOnError();
      }
      console.error(err);
    }
    callback(res, err);
  });
};
//Helper function to refresh token if expired
function refreshTokenOnError() {
  conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Regenerate Session for salesforce', conn.accessToken);
    }
  });
}

export const query = async (conn, query) => {
  try {
    const result = await conn.query(query)

    if (!result.records) {
      return { status: false, error: 'No records found' }
    }

    return result.records
  } catch (error) {
    if (Array.isArray(error) && error[0].message && error[0].message == 'Session expired or invalid') {
      await refreshTokenOnError()
    }
    return { status: false, error: error }
  }
}

export const update = async (conn, objName, sobjs) => {
  try {
    const result = await conn.sobject(objName).update(sobjs)

    if (!result) {
      return { status: false, error: 'No result returned' }
    }

    return result
  } catch (error) {
    if (Array.isArray(error) && error[0].message && error[0].message === 'Session expired or invalid') {
      await refreshTokenOnError()
    }
    return { status: false, error: error }
  }
}
