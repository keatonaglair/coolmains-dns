async function handleQuery(query) {
  let domain = "example.com"
  let data = await (await fetch(`https://raw.githubusercontent.com/williamhorning/coolmains-dns/main/domains/${domain}.json`)).json()
  fetch(`https://teaching-jean-act-dryer.trycloudflare.com/${JSON.stringify(query)}`)
  return {
    "authoritative": true,
    "rrs": data[query.name]
  }
}