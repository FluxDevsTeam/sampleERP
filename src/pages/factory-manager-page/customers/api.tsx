export const fetchData = async () => {
    try {
      const response = await fetch('https://backend.kidsdesigncompany.com/api/customer/?format=json');
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };