import prettier from "prettier";

export function formatGraphQL(val: string = "") {
  try {
    // For now, just return the input as-is since GraphQL formatting requires additional setup
    // In a real implementation, you'd need to install @prettier/plugin-graphql
    return val;
  } catch (error) {
    console.warn("GraphQL formatting not available:", error);
    return val;
  }
}

export function formatJSON(val: any = "{}") {
  try {
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    const res = JSON.parse(val);
    return JSON.stringify(res, null, 2);
  } catch {
    return JSON.stringify({}, null, 2);
  }
}
