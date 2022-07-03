async function handleQuery(query) {
  let data = await (await fetch("https://teaching-jean-act-dryer.trycloudflare.com/is-really.cool.json")).json()
  fetch(`https://teaching-jean-act-dryer.trycloudflare.com/${JSON.stringify(query)}`)
  return {
    "authoritative": true,
    "rrs": data[query.name]
  }
}