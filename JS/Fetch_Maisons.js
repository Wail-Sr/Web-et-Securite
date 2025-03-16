async function fetchMaisons(page) {
  const resultsContainer = document.querySelector("main.results");
  resultsContainer.innerHTML = "Chargement...";
  const { data, error } = await supabaseClient
    .from("maisons")
    .select(
      `
      *,
      statut_maison
      (status), 
      type_maison(nom),
      photos(type -> Exterieur,url)
    `
    )
    .range((page - 1) * 10, page * 10 - 1);

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Fetched maisons with related data:", data); // Ensure you're getting the data
  }
  return data;
}

async function filerMaisons(
  lieu,
  ville,
  pays,
  prixMax,
  capacite,
  surfaceMin,
  page
) {
  const resultsContainer = document.querySelector("main.results");
  resultsContainer.innerHTML = "Chargement...";
  let query = supabaseClient.from("maisons").select(
    `
      *,
      statut_maison(status),
      type_maison(nom),
      photos(type -> Exterieur, url)
    `
  );

  // Apply filters only if the parameter is not null
  if (lieu) {
    query = query.eq("id_statut", lieu);
  }

  if (ville) {
    query = query.ilike("ville", `%${ville}%`);
  }

  if (pays) {
    query = query.ilike("pays", `%${pays}%`);
  }

  if (prixMax) {
    query = query.lte("prix_par_nuit", prixMax);
  }

  if (capacite) {
    query = query.eq("chambres", capacite);
  }

  if (surfaceMin) {
    query = query.gte("superficie", surfaceMin);
  }

  query = query.range((page - 1) * 10, page * 10 - 1);

  const { data, error } = await query

  if (error) {
    console.error("Error fetching data:", error);
  }

  return data;
}

export { fetchMaisons, filerMaisons };
