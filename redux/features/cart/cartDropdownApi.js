export async function fetchCartDropdown(initialPost) {
  const response = await fetch("/api/cartdropdown", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ initialPost }),
  });

  const result = await response.json();

  return result;
}
