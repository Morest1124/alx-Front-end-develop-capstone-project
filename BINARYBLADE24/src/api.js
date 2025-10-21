const API_BASE_URL = '/';

export const getGigs = async () => {
  const response = await fetch(`${API_BASE_URL}db.json`);
  const data = await response.json();
  return data.gigs;
};

export const getGig = async (gigId) => {
  const gigs = await getGigs();
  return gigs.find((gig) => gig.id === parseInt(gigId));
};

export const createJob = async (jobDetails) => {
  console.log('Simulating API call to create a job:', jobDetails);
  // In a real application, you would make a POST request to your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}jobs`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(jobDetails),
  // });
  // const data = await response.json();
  // return data;

  // For now, we'll just return a promise that resolves with the job details
  return Promise.resolve(jobDetails);
};
