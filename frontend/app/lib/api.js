const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
};

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const getAdminProducts = async () => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data;
};

export const createProduct = async ({
  name,
  description,
  price,
  category,
  isFeatured,
  image,
}) => {
  const token = localStorage.getItem("adminToken");

  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("isFeatured", isFeatured);
  formData.append("image", image);

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product");
  }

  return data;
};

export const generateDescription = async ({
  name,
  category,
  material,
  artStyle,
  keyDetails,
}) => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/ai/generate-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      category,
      material,
      artStyle,
      keyDetails,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to generate description"
    );
  }

  return data;
};

export const updateProduct = async ({
  id,
  name,
  description,
  price,
  category,
  isFeatured,
  image,
}) => {
  const token = localStorage.getItem("adminToken");

  const formData = new FormData();

  if (name !== undefined) {
    formData.append("name", name);
  }

  if (description !== undefined) {
    formData.append("description", description);
  }

  if (price !== undefined) {
    formData.append("price", price);
  }

  if (category !== undefined) {
    formData.append("category", category);
  }

  if (isFeatured !== undefined) {
    formData.append("isFeatured", isFeatured);
  }

  if (image) {
    formData.append("image", image);
  }

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update product");
  }

  return data;
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
};