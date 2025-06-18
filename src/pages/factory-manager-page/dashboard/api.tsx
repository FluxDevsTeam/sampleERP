const JWT_TOKEN = localStorage.getItem('accessToken');

export const factoryData = async () => {
  try {
    const response = await fetch('https://backend.kidsdesigncompany.com/api/factory-manager-dashboard/?format=json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${JWT_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};