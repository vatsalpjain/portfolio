// Minimal GitHub GraphQL client for build time only (decision 0004, 0007).
// The token never reaches the browser: this module only runs during `astro build`/`astro dev`.

const ENDPOINT = "https://api.github.com/graphql";

/** Reads GH_DATA_TOKEN from the environment, loading a local .env file if present. */
export function getToken(): string | undefined {
  if (!process.env.GH_DATA_TOKEN) {
    try {
      process.loadEnvFile(".env");
    } catch {
      // No .env file: fine, sample data will be used locally.
    }
  }
  const token = process.env.GH_DATA_TOKEN?.trim();
  return token ? token : undefined;
}

export async function graphql<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string,
): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-site-build",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(
      `GitHub API responded ${res.status} ${res.statusText}. Check that GH_DATA_TOKEN is valid and not expired.`,
    );
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (json.errors?.length) {
    throw new Error(
      `GitHub API error: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!json.data) throw new Error("GitHub API returned no data.");
  return json.data;
}
