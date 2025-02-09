export async function getAllData(url, endpoint) {
  try {
      const response = await fetch(url + endpoint);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error(error.message);
      throw error;
  }
}

export async function getDataById(url, endpoint, id) {
  try {
      const response = await fetch(`${url}${endpoint}?id=${id}`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error(error.message);
      throw error;
  }
}

export async function deleteDataById(url, endpoint, id) {
  try {
      const response = await fetch(`${url}${endpoint}/${id}`, {
          method: 'DELETE',
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error(error.message);
      throw error;
  }
}

export async function addSong(url, endpoint, song) {
  try {
      const response = await fetch(`${url}${endpoint}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(song),
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Error adding song:', error);
      throw error;
  }
}

export async function updateSong(url, endpoint, id, updatedSong) {
  try {
      const response = await fetch(`${url}${endpoint}/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSong),
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Error updating song:', error);
      throw error;
  }
}
