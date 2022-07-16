let token = process.env.TOKEN

import coolmainsjson from '../domains/coolmains.com.json' assert { type: 'json' };
import isextremelycooljson from '../domains/is-extremely.cool.json' assert { type: 'json' };
import ismakingsomethingcooljson from '../domains/ismakingsomething.cool.json' assert { type: 'json' };

let etlds = [
  { records: coolmainsjson, zone: '0785e625-fa6a-4a78-835f-79c97e0bd6d0' },
  {
    records: isextremelycooljson,
    zone: '41e011e3-919a-45d4-af70-5d06553b763a',
  },
  { records: ismakingsomethingcooljson, zone: '8ea01045-e52d-4f49-bdb1-31474c088119' },
];

for (let etld of etlds) {
  let { zone, records } = etld;
  console.log(`Running zone ${zone}`);
  console.log(`Fetching existing records...`);
  let existingrecords = (
    await (
      await fetch(`https://packetframe.com/api/dns/records/${zone}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
    ).json()
  )['data']['records'];
  let existingrecordids = existingrecords.map((data) => data.id);
  console.log(`Found ${existingrecords.length} existing records`);
  console.log(`Adding ${records.length} new records...`);
  for (let record of records) {
    if (typeof record === 'string') continue;
    let { label, type, value } = record;
    console.log(`Adding record to ${label} ${type} ${value}`);
    await fetch('https://packetframe.com/api/dns/records', {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zone,
        type,
        label,
        value,
        ttl: 3600,
      }),
    });
    console.log(`Added record to ${label} successfully`);
  }
  console.log(`Added ${records.length} new records successfully`);
  console.log(`Deleting ${existingrecordids.length} existing records...`);
  for (let existingrecordid of existingrecordids) {
    console.log(`Deleting record ${existingrecordid}`);
    await fetch(`https://packetframe.com/api/dns/records/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zone,
        record: existingrecordid,
      }),
    });
    console.log(`Deleted record ${existingrecordid} successfully`);
  }
  console.log(`Deleted ${existingrecordids.length} existing records successfully`);
}
