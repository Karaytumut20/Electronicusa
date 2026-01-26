export const cities = [
  { name: 'New York', districts: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'] },
  { name: 'California', districts: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'] },
  { name: 'Texas', districts: ['Houston', 'Austin', 'Dallas', 'San Antonio', 'Fort Worth'] },
  { name: 'Florida', districts: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee'] },
  { name: 'Illinois', districts: ['Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio'] },
  { name: 'Washington', districts: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'] },
  { name: 'Nevada', districts: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'] },
  { name: 'Massachusetts', districts: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'] }
];

export const getDistricts = (cityName: string) => {
  const city = cities.find(c => c.name === cityName);
  return city ? city.districts.sort() : [];
};